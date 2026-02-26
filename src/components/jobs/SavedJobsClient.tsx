'use client';

import React, { useState } from 'react';
import { JobCard, Job } from '@/components/jobs/JobCard';
import { useRouter } from 'next/navigation';
import LetterCreationWizard from '@/components/motivation-letters/LetterCreationWizard';
import { Star, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    initialJobs: Job[];
    isPro: boolean;
    userId: string;
}

export default function SavedJobsClient({ initialJobs, isPro, userId }: Props) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const router = useRouter();

    const handleOptimize = (job: Job) => {
        setSelectedJob(job);
        setIsWizardOpen(true);
    };

    const handleToggleSave = async (job: Job) => {
        // Since this is the saved jobs page, toggling save means removing it
        const confirmRemove = window.confirm("Are you sure you want to remove this job from your favorites?");
        if (!confirmRemove) return;

        // Optimistic UI update
        setJobs(prev => prev.filter(j => j.id !== job.id));

        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobData: job, action: 'unsave' })
            });
            if (!res.ok) throw new Error('Failed to unsave');
            toast.success("Job removed from favorites.");
        } catch (error) {
            console.error(error);
            // Revert on error
            setJobs(prev => [job, ...prev]);
            toast.error("Failed to remove job.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB] py-8 px-6">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest border border-amber-100 mb-4">
                            <Star className="w-3.5 h-3.5" fill="currentColor" />
                            Favori İlanlarım
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                            Saved Jobs
                        </h1>
                        <p className="text-zinc-500 font-medium mt-2">
                            A list of all the job opportunities you have favorited.
                        </p>
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white border border-dashed rounded-3xl">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                            <Briefcase className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-zinc-900">No saved jobs yet</h3>
                            <p className="text-zinc-500 max-w-sm font-medium">
                                Head over to Scout Jobs, search for opportunities, and star the ones you like.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isPro={isPro}
                                isSaved={true}
                                onToggleSave={handleToggleSave}
                                onOptimize={handleOptimize}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isWizardOpen && (
                <LetterCreationWizard
                    isPro={isPro}
                    userId={userId}
                    initialJobData={selectedJob}
                    onClose={() => setIsWizardOpen(false)}
                    onSuccess={() => {
                        setIsWizardOpen(false);
                        window.location.href = '/motivation-letters';
                    }}
                />
            )}
        </div>
    );
}
