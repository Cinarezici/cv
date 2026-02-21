"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Sparkles, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function NewResumeForm() {
    const searchParams = useSearchParams();
    const [profileId, setProfileId] = useState<string | null>(searchParams.get('profileId'));
    const [profiles, setProfiles] = useState<any[]>([]);
    const [fetchingProfiles, setFetchingProfiles] = useState(true);
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProfiles = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
                setProfiles(data || []);
            }
            setFetchingProfiles(false);
        };
        fetchProfiles();
    }, []);

    if (fetchingProfiles) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;
    }

    if (!profileId) {
        return (
            <div className="space-y-6">
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Select Profile to Optimize</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium">
                            Choose which imported profile you want to tailor for your specific job application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {profiles.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-zinc-500 font-medium mb-4">You don't have any profiles yet.</p>
                                <Button onClick={() => router.push('/import')} className="bg-indigo-600 hover:bg-indigo-700 text-white">Import Profile</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profiles.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setProfileId(p.id)}
                                        className="border border-zinc-200 rounded-lg p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="font-bold text-zinc-900 line-clamp-1">{p.full_name}</p>
                                            <p className="text-sm text-zinc-500 line-clamp-1">{p.headline || 'No headline'}</p>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-zinc-300 group-hover:text-indigo-500 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleScrapeJobUrl = async () => {
        if (!jobUrl || !jobUrl.includes('linkedin.com')) {
            setError("Lütfen geçerli bir LinkedIn iş ilanı linki girin.");
            return;
        }
        setIsScraping(true);
        setError(null);
        try {
            const res = await fetch('/api/scout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: jobUrl, type: 'job-details' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'İlan detayları çekilemedi');

            if (data.results && data.results.length > 0) {
                const job = data.results[0];
                if (job.title) setJobTitle(job.title);
                if (job.companyName) setCompany(job.companyName);
                if (job.description) setJd(job.description);
            } else {
                setError("İlan metni bulunamadı. Lütfen URL'yi kontrol edin veya manuel yapıştırın.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsScraping(false);
        }
    };

    const handleOptimize = async () => {
        if (!jd.trim()) {
            setError("Lütfen bir iş ilanı metni (Job Description) girin.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Append Job Title and Company to JD so AI has context if provided manually
            const fullContextJd = `Job Title: ${jobTitle}\nCompany: ${company}\n\n${jd}`;

            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, jobDescription: fullContextJd }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Özgeçmiş optimize edilemedi.');
            }

            // Redirect directly to the generated public link
            if (data.resume?.public_link_slug) {
                router.push(`/r/${data.resume.public_link_slug}`);
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Bilinmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const selectedProfile = profiles.find(p => p.id === profileId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-zinc-800" />
                        Job Optimization
                    </h2>
                    <p className="text-zinc-500 mt-1">
                        Paste a job description to tailor your CV specifically for that role based on <span className="font-semibold text-indigo-700">{selectedProfile?.full_name}</span>.
                    </p>
                </div>
                <Button onClick={() => setProfileId(null)} variant="outline" className="h-10 border-zinc-200 text-zinc-600 hover:bg-zinc-100 font-semibold" disabled={loading}>
                    Change Profile
                </Button>
            </div>

            {error && <p className="text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 text-sm font-medium">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* Left Column: Job Details */}
                <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold">Job Details</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium">Tell us about the role you are applying for.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-zinc-700">Job Title</label>
                            <input
                                placeholder="e.g. Senior Frontend Engineer"
                                className="flex h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-zinc-700">Company</label>
                            <input
                                placeholder="e.g. Google"
                                className="flex h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-zinc-700 flex justify-between items-center">
                                Job URL (Optional)
                                <button onClick={handleScrapeJobUrl} disabled={isScraping || !jobUrl} className="text-xs text-indigo-600 font-bold hover:underline disabled:opacity-50 flex items-center gap-1">
                                    {isScraping ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                    Fetch URL
                                </button>
                            </label>
                            <input
                                placeholder="https://linkedin.com/jobs/..."
                                className="flex h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                                value={jobUrl}
                                onChange={(e) => setJobUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleScrapeJobUrl()}
                            />
                            <p className="text-xs text-zinc-400 mt-1">LinkedIn URL'sini girip "Fetch" diyerek ilanı otomatik doldurabilirsiniz.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Job Description */}
                <Card className="border shadow-sm rounded-xl overflow-hidden bg-white h-[420px] flex flex-col">
                    <CardHeader className="pb-4 shrink-0">
                        <CardTitle className="text-lg font-bold">Job Description</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium">Paste the full job description here.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 flex-1 pb-6">
                        <Textarea
                            placeholder="We are looking for a highly skilled..."
                            className="h-full w-full resize-none border-zinc-300 text-sm focus-visible:ring-zinc-950"
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleOptimize} disabled={loading} className="w-full md:w-auto px-8 h-12 bg-zinc-500 hover:bg-zinc-600 text-white font-semibold text-base transition-colors shrink-0">
                    {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Optimizing...</>
                    ) : (
                        <><Sparkles className="mr-2 h-5 w-5" /> Optimize My CV</>
                    )}
                </Button>
            </div>
        </div>
    );
}

function ChevronRightIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

export default function NewResumePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-8 bg-[#fbfbfb] min-h-[calc(100vh-100px)] text-zinc-900">
            <h1 className="text-3xl font-extrabold tracking-tight mb-8 hidden">CV Optimizer</h1>
            <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500 w-8 h-8" /></div>}>
                <NewResumeForm />
            </Suspense>
        </div>
    );
}
