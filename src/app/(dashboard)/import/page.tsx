"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Linkedin, FileText, AlertCircle } from 'lucide-react';

export default function ImportPage() {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Profil alınamadı. Bot engellemesi olabilir, lütfen Manuel Metin kopyalama sekmesini kullanın.');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleImportText = async () => {
        if (!text.trim()) {
            setError("Lütfen LinkedIn profil metninizi girin.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/parse-linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkedinText: text }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to parse LinkedIn profile');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6 text-zinc-100">LinkedIn Profilini İçe Aktar</h1>

            <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900/50">
                    <TabsTrigger value="url" className="data-[state=active]:bg-zinc-800">
                        <Linkedin className="w-4 h-4 mr-2 text-blue-500" />
                        Otomatik (URL ile)
                    </TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-zinc-800">
                        <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                        Manuel (%100 Güvenilir)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                    <Card className="border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl">Apify Scraper (Otomatik)</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Sadece linki yapıştırın ve bekleyin. (Not: LinkedIn bot koruması veya Apify kota limitine takılabilir)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200">LinkedIn Profil URL</label>
                                <Input
                                    placeholder="https://www.linkedin.com/in/username/"
                                    className="bg-zinc-950 border-zinc-800 h-12"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            <Button onClick={handleImportUrl} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analiz ediliyor...</>
                                ) : "Profili İçe Aktar"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="text">
                    <Card className="border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl">Manuel Metin Aktarımı (Önerilen)</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Hiçbir engele takılmaz. LinkedIn profilinizi tarayıcıdan açın, "Ctrl + A" basıp tüm sayfayı seçin, "Ctrl + C" ile kopyalayın ve aşağıdaki kutuya yapıştırın. Yapay zekamız içinden sadece ilgili yerleri anında çıkaracaktır.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Textarea
                                placeholder="Tüm metni buraya yapıştırın (Bozuk veya düzensiz olması önemli değil, GPT-4o hepsini düzeltecektir)..."
                                className="min-h-[300px] resize-y bg-zinc-950 border-zinc-800"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            <Button onClick={handleImportText} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12">
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> AI ile Optimize Ediliyor...</>
                                ) : "Metinden CV Çıkart"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
