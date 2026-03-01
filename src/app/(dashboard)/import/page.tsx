"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Linkedin, FileUp, AlertCircle, CheckCircle2, ChevronRight, Keyboard, Sparkles, FileText, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { usePro } from '@/hooks/usePro';
import LockedPageView from '@/components/LockedPageView';

export default function ImportPage() {
    const { status, isPro, isLoading: proLoading } = usePro();
    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successProfileId, setSuccessProfileId] = useState<string | null>(null);
    const [cvCount, setCvCount] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCvCount = async () => {
            const supabase = createClient();
            const { count } = await supabase
                .from('resumes')
                .select('*', { count: 'exact', head: true });
            setCvCount(count || 0);
        };
        fetchCvCount();
    }, []);

    if (!proLoading && status === 'canceled') {
        return <LockedPageView featureName="Import CV" subtitle="Import your LinkedIn profile or upload a PDF with a Pro subscription." />;
    }

    const handleImportUrl = async () => {
        const isLinkedInUrl = url.trim().includes("linkedin.com/in/");

        if (!url.trim()) {
            setError("Please enter a LinkedIn URL or paste your CV text.");
            return;
        }

        if (!isPro) {
            router.push('/upgrade');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const body = isLinkedInUrl ? { linkedinUrl: url } : { linkedinText: url };
            const res = await fetch('/api/ai/parse-linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch LinkedIn profile.');
            }

            setSuccessProfileId(data.profile?.id || 'new');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleImportPdf = async () => {
        if (!file) {
            setError("Please select a PDF file to import.");
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Only PDF files are supported.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/ai/parse-pdf', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to parse PDF.');
            }

            setSuccessProfileId(data.profile?.id || 'new');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (successProfileId) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-[calc(100vh-100px)] text-zinc-900">
                <Card className="border shadow-sm rounded-xl overflow-hidden text-center p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                    <div className="flex justify-center mb-6">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2 dark:text-white">Profile Imported Successfully!</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 text-base">
                        AI has structured your data. Now, what would you like to do?
                    </CardDescription>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Button
                            onClick={() => router.push(successProfileId === 'new' ? '/resumes/base' : `/resumes/base`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 font-semibold text-lg"
                        >
                            Convert to Base CV
                        </Button>
                        <Button
                            onClick={() => router.push(successProfileId === 'new' ? '/resumes/new' : `/resumes/new?profileId=${successProfileId}`)}
                            variant="outline"
                            className="h-14 font-semibold text-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
                        >
                            Tailor for Job
                        </Button>
                    </div>
                    <div className="mt-8">
                        <Button variant="ghost" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5" onClick={() => router.push('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-[calc(100vh-100px)] text-zinc-900">
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Import Profile</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Create your base profile quickly using one of the methods below.</p>

            <Tabs defaultValue="url" className="w-full">
                {/* Mobile: 2×2 grid, Desktop: single row */}
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-300 rounded-xl p-1.5 transition-all gap-1 h-auto sm:h-[52px] sm:items-stretch">
                    <TabsTrigger value="url" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/15 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-semibold relative py-2.5 sm:py-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 h-auto text-xs sm:text-[13px]">
                        <Linkedin className="w-4 h-4 sm:mr-2 shrink-0" />
                        <span>LinkedIn URL</span>
                        {isPro === false && !proLoading && (
                            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                                PRO
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/15 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-semibold py-2.5 sm:py-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 h-auto text-xs sm:text-[13px]">
                        <FileUp className="w-4 h-4 sm:mr-2 shrink-0" />
                        <span>PDF Upload</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/15 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-semibold relative py-2.5 sm:py-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 h-auto text-xs sm:text-[13px]">
                        <FileText className="w-4 h-4 sm:mr-2 shrink-0" />
                        <span>Manual Text</span>
                        {isPro === false && !proLoading && (
                            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                                PRO
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/15 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-semibold py-2.5 sm:py-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 h-auto text-xs sm:text-[13px]">
                        <Keyboard className="w-4 h-4 sm:mr-2 shrink-0" />
                        <span>From Scratch</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                    <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold dark:text-white">Import from LinkedIn</CardTitle>
                            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                                Just paste the link and wait. Handled securely in the background using Apify Scraper.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">LinkedIn Profile URL</label>
                                <Input
                                    placeholder="https://www.linkedin.com/in/username/"
                                    className="bg-white dark:bg-transparent border-zinc-300 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 h-12"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleImportUrl()}
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {proLoading ? (
                                <div className="h-12 w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-500" />
                                </div>
                            ) : isPro ? (
                                <Button onClick={handleImportUrl} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold">
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching LinkedIn Data...</>
                                    ) : "Import from LinkedIn"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => window.location.href = 'https://cvoptimizerai.com/upgrade'}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-bold flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Upgrade to Pro for LinkedIn Import
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pdf">
                    <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl flex flex-col bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold dark:text-white">Upload existing CV (PDF)</CardTitle>
                            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                                Upload your existing resume to import the profile. Our AI model will instantly structure your data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className={`border-2 border-dashed ${file ? 'border-indigo-500 dark:border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/5'} rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors`}>
                                <FileUp className={`h-10 w-10 mb-4 ${file ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                    {file ? 'File Selected' : 'Choose a PDF file to upload'}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">
                                    {file ? file.name : 'Maximum file size: 5MB'}
                                </p>
                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    className="cursor-pointer max-w-sm mx-auto"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200 mt-6">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Button
                                onClick={handleImportPdf}
                                disabled={loading || !file}
                                className={`w-full h-14 font-bold text-lg shadow-sm ${file ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-zinc-200 text-zinc-500'}`}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Uploading and Analyzing...</>
                                ) : "Upload and Parse to CV"}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="text">
                    <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold dark:text-white">Import from Text</CardTitle>
                            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                                Paste your plain text resume or LinkedIn "About" content. AI will structure it for you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <textarea
                                value={url} // Reusing the same state or add new one? I'll use url or generic 'content'
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste your resume text here..."
                                className="w-full h-48 bg-white dark:bg-transparent border border-zinc-300 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                            {proLoading ? (
                                <div className="h-12 w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-500" />
                                </div>
                            ) : isPro ? (
                                <Button
                                    onClick={() => handleImportUrl()} // handleImportUrl handles both url and text in API
                                    disabled={loading || !url.trim()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-semibold"
                                >
                                    {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Text...</> : "Parse Text to CV"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => window.location.href = 'https://cvoptimizerai.com/upgrade'}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-bold flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Upgrade to Pro for AI Text Import
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manual">
                    <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold dark:text-white">Manual Entry</CardTitle>
                            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                                Don&apos;t have a LinkedIn profile or a PDF? You can manually type your experience, education, and skills.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-8 text-center pt-4">
                            {proLoading || cvCount === null ? (
                                <div className="h-14 w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-xl flex items-center justify-center max-w-sm mx-auto">
                                    <Loader2 className="w-5 h-5 animate-spin text-zinc-400 dark:text-zinc-500" />
                                </div>
                            ) : (isPro || cvCount < 2) ? (
                                <Button
                                    onClick={() => router.push('/builder/new')}
                                    className="w-full sm:w-auto bg-orange-500/90 hover:bg-orange-500 text-orange-50 h-14 px-8 font-bold text-lg rounded-xl shadow-md shadow-orange-200/40 dark:shadow-orange-900/20 transition-all active:scale-95"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Start From Blank CV
                                    {!isPro && <span className="ml-2 text-xs font-normal opacity-75">({cvCount}/2 usage)</span>}
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6 max-w-md mx-auto">
                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <p className="text-zinc-900 dark:text-zinc-100 font-bold mb-1">Limit Reached</p>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4">You have used your 2 free "From Scratch" CV credits. Upgrade to Pro for unlimited access.</p>
                                        <Button
                                            onClick={() => window.location.href = 'https://cvoptimizerai.com/upgrade'}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold rounded-xl shadow-md"
                                        >
                                            Upgrade to Pro for Unlimited
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
