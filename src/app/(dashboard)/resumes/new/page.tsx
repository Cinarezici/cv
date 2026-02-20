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

    const handleOptimize = async () => {
        if (!jd.trim()) {
            setError("Lütfen bir iş ilanı metni (Job Description) girin.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, jobDescription: jd }),
            });

            if (!res.ok) {
                throw new Error('Özgeçmiş optimize edilemedi.');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Bilinmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const selectedProfile = profiles.find(p => p.id === profileId);

    return (
        <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-2xl font-bold text-zinc-900">Tailor your Resume</CardTitle>
                </div>
                <CardDescription className="text-zinc-600 font-medium text-base">
                    You selected <span className="font-bold text-indigo-700">{selectedProfile?.full_name || 'Profile'}</span>. Paste the Job Description for the role you're applying for.
                    Our AI will optimize your experience bullets to match the employer's needs.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <Textarea
                    placeholder="Paste the Job Description here (Requirements, Responsibilities, etc.)..."
                    className="min-h-[400px] resize-y bg-zinc-50 border-zinc-200 text-zinc-900 focus-visible:ring-indigo-500"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                />
                {error && <p className="text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 text-sm font-medium">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button onClick={handleOptimize} disabled={loading} className="w-full sm:flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                AI is tailoring your resume...
                            </>
                        ) : "Optimize Resume using AI"}
                    </Button>
                    <Button onClick={() => setProfileId(null)} variant="outline" className="w-full sm:w-auto h-14 border-zinc-200 text-zinc-600 hover:bg-zinc-100 font-semibold" disabled={loading}>
                        Change Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
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
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-6 bg-zinc-50 min-h-[calc(100vh-100px)] text-zinc-900">
            <h1 className="text-3xl font-extrabold tracking-tight">AI Optimization Engine</h1>
            <p className="text-zinc-500 font-medium">Create a heavily customized JSON resume tailored specifically to bypass Applicant Tracking Systems (ATS).</p>
            <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500 w-8 h-8" /></div>}>
                <NewResumeForm />
            </Suspense>
        </div>
    );
}
