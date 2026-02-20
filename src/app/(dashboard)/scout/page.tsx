"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Loader2, Briefcase, Users } from 'lucide-react';

export default function ScoutPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [type, setType] = useState<'jobs' | 'people'>('jobs');
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Lütfen bir arama kelimesi girin');
            return;
        }

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch('/api/scout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, type }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Arama yapılamadı.');

            setResults(data.results || []);
        } catch (err: any) {
            setError(err.message || 'Bilinmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 min-h-[calc(100vh-100px)] text-zinc-900">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Scout (Find Jobs & Similar Profiles)</h1>
                <p className="text-zinc-500 font-medium">Use AI to scrape LinkedIn jobs or profiles to expand your network.</p>
            </div>

            <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader>
                    <Tabs value={type} onValueChange={(v) => setType(v as 'jobs' | 'people')} className="w-full max-w-sm mb-4">
                        <TabsList className="grid w-full grid-cols-2 bg-zinc-100 text-zinc-600 rounded-lg p-1">
                            <TabsTrigger value="jobs" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-md font-semibold">
                                <Briefcase className="w-4 h-4 mr-2" /> Jobs
                            </TabsTrigger>
                            <TabsTrigger value="people" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-md font-semibold">
                                <Users className="w-4 h-4 mr-2" /> People
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <CardDescription className="text-zinc-500 font-medium">
                        {type === 'jobs'
                            ? "Enter a job title and location (e.g. 'Frontend Developer London') to scrape open job listings on LinkedIn."
                            : "Enter a skill or role (e.g. 'Senior React Developer') to find similar LinkedIn profiles for networking."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder={`Search ${type}...`}
                            className="bg-zinc-50 border-zinc-300 h-12"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 font-bold">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                    {error && <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">{error}</p>}
                </CardContent>
            </Card>

            {loading && (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((r, i) => (
                        <Card key={i} className="border shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-1">{type === 'jobs' ? r.title : r.fullName || r.name || 'Unknown Profile'}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {type === 'jobs' ? (
                                        <>
                                            <span className="font-semibold text-zinc-700">{r.companyName}</span> <br />
                                            {r.location}
                                        </>
                                    ) : (
                                        r.headline || r.title || 'No headline available'
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <a
                                    href={type === 'jobs' ? r.url : r.url || r.linkedinUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button variant="outline" className="w-full font-semibold">View on LinkedIn</Button>
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
