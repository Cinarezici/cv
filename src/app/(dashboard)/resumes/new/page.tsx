"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { usePro } from '@/hooks/usePro';
import Link from 'next/link';

function NewResumeForm() {
    const searchParams = useSearchParams();
    const [documentId, setDocumentId] = useState<string | null>(searchParams.get('documentId') || searchParams.get('profileId'));
    const [documentType, setDocumentType] = useState<'profile' | 'resume' | null>(
        searchParams.get('type') as any || (searchParams.get('profileId') ? 'profile' : null)
    );
    const [documents, setDocuments] = useState<any[]>([]);
    const [fetchingDocs, setFetchingDocs] = useState(true);
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const [{ data: profs }, { data: res }] = await Promise.all([
                        supabase.from('profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                        supabase.from('resumes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
                    ]);

                    const docs = [];
                    if (profs) {
                        docs.push(...profs.map(p => ({
                            id: p.id,
                            type: 'profile',
                            title: p.full_name ? `${p.full_name} — CV'im` : 'LinkedIn Profile',
                            subtitle: p.headline || 'Imported Profile',
                            updatedAt: p.updated_at || p.created_at,
                            _raw: p
                        })));
                    }
                    if (res) {
                        docs.push(...res.map(r => ({
                            id: r.id,
                            type: 'resume',
                            title: r.job_title || 'Untitled CV',
                            subtitle: r.theme_category ? `Theme: ${r.theme_category}` : 'Standard',
                            updatedAt: r.updated_at,
                            _raw: r
                        })));
                    }
                    docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    setDocuments(docs);
                }
            } catch (err) {
                console.error('Error fetching docs:', err);
            } finally {
                setFetchingDocs(false);
            }
        };
        fetchDocs();
    }, []);

    const handleDocDelete = async (e: React.MouseEvent, id: string, type: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const endpoint = type === 'profile' ? `/api/profiles/${id}` : `/api/resumes/${id}`;
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (!res.ok) throw new Error('Deletion failed');

            setDocuments(prev => prev.filter(d => d.id !== id));
            toast.success('Document successfully deleted');
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        }
    };

    const { isPro, isLoading: proLoading } = usePro();

    if (fetchingDocs || proLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-400 w-7 h-7" /></div>;
    }

    if (!isPro) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <Card className="border-0 shadow-2xl max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="bg-orange-500 p-8 text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-xl">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Pro Feature</h2>
                        <p className="text-orange-50 text-lg">AI CV Optimization is a Premium feature.</p>
                    </div>
                    <CardContent className="p-10 text-center space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-zinc-900">Tailor your CV perfectly for every job description.</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">✓</div>
                                    AI-powered bullet points
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">✓</div>
                                    Job-specific tailoring
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">✓</div>
                                    ATS-Friendly Keywords
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">✓</div>
                                    Higher response rates
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button
                                onClick={() => window.location.href = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL!}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 font-bold text-xl rounded-2xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Upgrade to Pro
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/dashboard')}
                                className="text-zinc-500 font-bold h-12"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!documentId) {
        return (
            <div className="space-y-6">
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Choose your CV</CardTitle>
                        <CardDescription className="text-zinc-500">
                            Select the CV or Profile you want to optimize for a specific job.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {documents.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-zinc-500 font-medium mb-4">You don't have any CVs yet.</p>
                                <Button onClick={() => router.push('/import')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Import LinkedIn / Add CV
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {documents.map(doc => (
                                    <div
                                        key={`${doc.type}-${doc.id}`}
                                        onClick={() => {
                                            setDocumentId(doc.id);
                                            setDocumentType(doc.type);
                                        }}
                                        className="border border-zinc-200 rounded-xl p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-between group relative"
                                    >
                                        <div className="flex-1 min-w-0 pr-10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    {doc.type}
                                                </span>
                                                <p className="font-bold text-zinc-900 truncate">{doc.title}</p>
                                            </div>
                                            <p className="text-sm text-zinc-500 mt-1 truncate">{doc.subtitle}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDocDelete(e, doc.id, doc.type)}
                                                className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-indigo-500 shrink-0" />
                                        </div>
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
            setError('Please paste a job description.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const fullContextJd = [jobTitle && `Job Title: ${jobTitle}`, company && `Company: ${company}`, jd].filter(Boolean).join('\n');
            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId, documentType, jobDescription: fullContextJd }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to optimize CV.');

            if (data.resume?.public_link_slug) {
                toast.success('CV Optimized Successfully', { description: 'Your tailored CV is ready!' });
                router.push(`/r/${data.resume.public_link_slug}`);
            } else {
                toast.success('CV Optimized Successfully');
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const selectedDoc = documents.find(d => d.id === documentId && d.type === documentType);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        CV Optimization
                    </h2>
                    <p className="text-zinc-500 mt-1 text-sm">
                        Preparing a tailored CV targeting the job using <span className="font-semibold text-indigo-700">{selectedDoc?.title}</span>.
                    </p>
                </div>
                <Button onClick={() => setDocumentId(null)} variant="outline" className="h-9 text-sm" disabled={loading}>
                    Change CV
                </Button>
            </div>

            {error && <p className="text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 text-sm font-medium">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
                {/* Left: optional meta */}
                <Card className="md:col-span-2 border shadow-sm rounded-xl bg-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold">Job Details <span className="text-zinc-400 font-normal text-xs">(optional)</span></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Job Title</label>
                            <input
                                placeholder="Senior Frontend Engineer"
                                className="mt-1 flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Company</label>
                            <input
                                placeholder="Google"
                                className="mt-1 flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right: job description */}
                <Card className="md:col-span-3 border shadow-sm rounded-xl bg-white h-[340px] flex flex-col">
                    <CardHeader className="pb-3 shrink-0">
                        <CardTitle className="text-base font-bold">Job Description</CardTitle>
                        <CardDescription>Paste the entire job description text here.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-5">
                        <Textarea
                            placeholder="We are looking for a highly skilled..."
                            className="h-full w-full resize-none border-zinc-300 text-sm focus-visible:ring-indigo-500"
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleOptimize}
                    disabled={loading}
                    className="px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base gap-2"
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Optimizing...</>
                    ) : (
                        <><Sparkles className="h-4 w-4" /> Optimize My CV</>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default function NewResumePage() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-6 min-h-[calc(100vh-100px)] text-zinc-900">
            <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-400 w-8 h-8" /></div>}>
                <NewResumeForm />
            </Suspense>
        </div>
    );
}
