"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Linkedin, FileUp, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ImportPage() {
    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successProfileId, setSuccessProfileId] = useState<string | null>(null);
    const router = useRouter();

    const handleImportUrl = async () => {
        if (!url.trim() || !url.includes("linkedin.com/in/")) {
            setError("Lütfen geçerli bir LinkedIn profil URL'si girin.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/parse-linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkedinUrl: url }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'LinkedIn profili alınırken hata oluştu.');
            }

            setSuccessProfileId(data.profile?.id || 'new');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleImportPdf = async () => {
        if (!file) {
            setError("Lütfen içe aktarmak için bir PDF seçin.");
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Sadece PDF dosyaları desteklenmektedir.");
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
                throw new Error(data.error || 'PDF alınırken hata oluştu.');
            }

            setSuccessProfileId(data.profile?.id || 'new');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (successProfileId) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 min-h-[calc(100vh-100px)] text-zinc-900">
                <Card className="border shadow-sm rounded-xl overflow-hidden text-center p-8 bg-white border-zinc-200">
                    <div className="flex justify-center mb-6">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">Profile Imported Successfully!</CardTitle>
                    <CardDescription className="text-zinc-500 font-medium mb-8 text-base">
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
                            className="h-14 font-semibold text-lg border-zinc-300 hover:bg-zinc-50"
                        >
                            Tailor for Job
                        </Button>
                    </div>
                    <div className="mt-8">
                        <Button variant="ghost" className="text-zinc-500" onClick={() => router.push('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 min-h-[calc(100vh-100px)] text-zinc-900">
            <h1 className="text-3xl font-extrabold tracking-tight">Import Profile</h1>
            <p className="text-zinc-500 font-medium">Create your base profile quickly using one of the methods below.</p>

            <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-200 text-zinc-600 rounded-lg p-1">
                    <TabsTrigger value="url" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-md font-semibold">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn URL
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-md font-semibold">
                        <FileUp className="w-4 h-4 mr-2" />
                        PDF Upload
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                    <Card className="border shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Import from LinkedIn</CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">
                                Sadece linki yapıştırın ve bekleyin. Güçlü Apify Scraper ile arka planda işlenir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">LinkedIn Profil URL</label>
                                <Input
                                    placeholder="https://www.linkedin.com/in/username/"
                                    className="bg-white border-zinc-300 h-12"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                            <Button onClick={handleImportUrl} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold">
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching LinkedIn Data...</>
                                ) : "Import from LinkedIn"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pdf">
                    <Card className="border shadow-sm rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Upload existing CV (PDF)</CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">
                                Mevcut özgeçmişinizi yükleyerek profili okutun. Dünyanın en iyi AI modeli tüm yapıyı anında algılayacaktır.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-100 transition-colors">
                                <FileUp className="h-10 w-10 text-zinc-400 mb-4" />
                                <h3 className="font-semibold text-zinc-700 mb-1">Choose a PDF file to upload</h3>
                                <p className="text-sm text-zinc-500 mb-4">Maximum file size: 5MB</p>
                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    className="cursor-pointer"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                            <Button onClick={handleImportPdf} disabled={loading || !file} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-semibold">
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Parsing PDF and Extracting AI...</>
                                ) : "Upload and Parse Resume"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
