"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { JobSearchForm } from '@/components/jobs/JobSearchForm';
import { JobCard, Job } from '@/components/jobs/JobCard';
import { JobSearchLoader } from '@/components/jobs/JobSearchLoader';
import LetterCreationWizard from '@/components/motivation-letters/LetterCreationWizard';
import { Search, Briefcase, TriangleAlert, Info, Sparkles, X } from 'lucide-react';
import { usePro } from '@/hooks/usePro';
import LockedPageView from '@/components/LockedPageView';

export default function ScoutPage() {
    const { status: subStatus, isLoading: subLoading } = usePro();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<{ keywords: string; location: string } | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isBulkWizardOpen, setIsBulkWizardOpen] = useState(false);
    const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [isPro, setIsPro] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();

    useEffect(() => {
        const initData = async () => {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
                setIsPro(['active'].includes(sub?.status as string));
            }

            try {
                const res = await fetch('/api/jobs/save');
                if (res.ok) {
                    const data = await res.json();
                    if (data.jobs) {
                        setSavedJobIds(data.jobs.map((j: Job) => j.id));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch saved jobs", err);
            }
        };
        initData();
    }, []);

    const handleSearch = async (keywords: string, location: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setStatus('loading');
        setError(null);
        setQuery({ keywords, location });

        try {
            // 1. Initial Start Request
            const startRes = await fetch('/api/jobs/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords, location }),
                signal: abortControllerRef.current.signal,
            });

            if (!startRes.ok) {
                const data = await startRes.json();
                throw new Error(data.error || 'Failed to start search service.');
            }

            const { runId, datasetId } = await startRes.json();

            // 2. Polling Loop
            let isPolling = true;
            let attempts = 0;
            const maxAttempts = 100; // ~300 seconds total (3s interval)

            while (isPolling && attempts < maxAttempts) {
                if (abortControllerRef.current.signal.aborted) break;

                await new Promise(resolve => setTimeout(resolve, 3000));
                attempts++;

                const statusRes = await fetch(`/api/jobs/search?runId=${runId}&datasetId=${datasetId}`, {
                    signal: abortControllerRef.current.signal,
                });

                if (!statusRes.ok) continue;

                const statusData = await statusRes.json();

                if (statusData.status === 'SUCCEEDED') {
                    setJobs(statusData.jobs || []);
                    setStatus('success');
                    isPolling = false;
                    break;
                } else if (statusData.status === 'FAILED' || statusData.status === 'ABORTED' || statusData.status === 'TIMED-OUT') {
                    throw new Error(statusData.error || `Search failed with status: ${statusData.status}`);
                }
            }

            if (isPolling && attempts >= maxAttempts) {
                throw new Error('Search timed out after 300 seconds. Please try again or refine your search.');
            }

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.error('Search error:', err);
            setError(err.message || 'An unexpected error occurred.');
            setStatus('error');
        }
    };

    const handleOptimize = (job: Job) => {
        setSelectedJob(job);
        setIsWizardOpen(true);
    };

    const handleToggleSelect = (job: Job) => {
        setSelectedJobs(prev =>
            prev.some(j => j.id === job.id)
                ? prev.filter(j => j.id !== job.id)
                : [...prev, job]
        );
    };

    const handleBulkOptimize = () => {
        if (selectedJobs.length === 0) return;
        const mergedDescription = selectedJobs
            .map(j => `## ${j.title} @ ${j.companyName}\n${j.descriptionText}`)
            .join('\n\n---\n\n');

        const bulkJob: Job = {
            ...selectedJobs[0],
            title: selectedJobs.length === 1
                ? selectedJobs[0].title
                : `${selectedJobs.length} Seçili İlan`,
            descriptionText: mergedDescription,
        };
        setSelectedJob(bulkJob);
        setIsBulkWizardOpen(true);
    };

    const handleToggleSave = async (job: Job) => {
        const isSaved = savedJobIds.includes(job.id);
        const action = isSaved ? 'unsave' : 'save';

        // Optimistic UI update
        if (isSaved) {
            setSavedJobIds(prev => prev.filter(id => id !== job.id));
        } else {
            setSavedJobIds(prev => [...prev, job.id]);
        }

        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobData: job, action })
            });
            if (!res.ok) throw new Error('Failed to toggle save');
        } catch (error) {
            // Revert on error
            console.error(error);
            if (isSaved) {
                setSavedJobIds(prev => [...prev, job.id]);
            } else {
                setSavedJobIds(prev => prev.filter(id => id !== job.id));
            }
        }
    };

    if (!subLoading && subStatus === 'canceled') {
        return <LockedPageView featureName="Search Jobs" subtitle="Search LinkedIn job listings in real-time with a Pro subscription." />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        <Briefcase className="w-3.5 h-3.5" />
                        LinkedIn Scout
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        Find your next <span className="text-indigo-600 dark:text-indigo-400">opportunity</span>.
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
                        Search LinkedIn for real-time job listings and let AI optimize your CV for the perfect match.
                    </p>
                </div>

                <JobSearchForm onSearch={handleSearch} isLoading={status === 'loading'} />
            </div>

            {/* Content Section */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
                {status === 'idle' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-inner">
                            <Search className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Ready to start searching?</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm font-medium">
                                Enter a job title and location above to fetch the latest opportunities from LinkedIn.
                            </p>
                        </div>
                    </div>
                )}

                {status === 'loading' && (
                    <JobSearchLoader keywords={query?.keywords} location={query?.location} />
                )}

                {status === 'error' && (
                    <div className="max-w-lg mx-auto bg-white dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/50 rounded-3xl p-8 shadow-sm text-center space-y-6">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto">
                            <TriangleAlert className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Something went wrong</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{error}</p>
                        </div>
                        <button
                            onClick={() => query && handleSearch(query.keywords, query.location)}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-full font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all scale-100 active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {status === 'success' && jobs.length === 0 && (
                    <div className="max-w-lg mx-auto text-center py-20 space-y-6">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-300 dark:text-zinc-600 mx-auto">
                            <Search className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No jobs found for "{query?.keywords}"</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Try broadening your search or checking for typos.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                            <button onClick={() => handleSearch(query?.keywords || '', 'Remote')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors uppercase tracking-wider">Try Remote</button>
                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors uppercase tracking-wider">Change Title</button>
                        </div>
                    </div>
                )}

                {status === 'success' && jobs.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    {jobs.length}+ Opportunities Found
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                                    Showing the latest "{query?.keywords}" jobs in {query?.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] bg-zinc-50 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-100 dark:border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Real-time LinkedIn Data
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    isPro={true}
                                    isSaved={savedJobIds.includes(job.id)}
                                    isSelected={selectedJobs.some(j => j.id === job.id)}
                                    onToggleSave={handleToggleSave}
                                    onToggleSelect={handleToggleSelect}
                                    onOptimize={handleOptimize}
                                />
                            ))}
                        </div>

                        <div className="text-center py-12 border-t border-zinc-100 dark:border-white/5">
                            <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">Showing top 50 results. Refine your search for more specific outcomes.</p>
                        </div>
                    </div>
                )}
            </div>

            {isWizardOpen && userId && (
                <LetterCreationWizard
                    isPro={isPro}
                    userId={userId}
                    initialJobData={selectedJob}
                    onClose={() => setIsWizardOpen(false)}
                    onSuccess={() => {
                        setIsWizardOpen(false);
                        router.push('/motivation-letters');
                    }}
                />
            )}

            {isBulkWizardOpen && userId && selectedJob && (
                <LetterCreationWizard
                    isPro={isPro}
                    userId={userId}
                    initialJobData={selectedJob}
                    onClose={() => { setIsBulkWizardOpen(false); }}
                    onSuccess={() => {
                        setIsBulkWizardOpen(false);
                        setSelectedJobs([]);
                        router.push('/motivation-letters');
                    }}
                />
            )}

            {/* Bulk Selection Bar */}
            {selectedJobs.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-zinc-700 animate-in slide-in-from-bottom-4 duration-300">
                    <span className="text-sm font-bold">
                        {selectedJobs.length} {selectedJobs.length === 1 ? 'job' : 'jobs'} selected
                    </span>
                    <div className="w-px h-5 bg-zinc-600" />
                    <button
                        onClick={handleBulkOptimize}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Bulk Optimize CV
                    </button>
                    <button
                        onClick={() => setSelectedJobs([])}
                        className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                        title="Clear selection"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
