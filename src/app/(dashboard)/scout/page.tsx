"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MapPin, Building, ExternalLink } from 'lucide-react';

export default function ScoutPage() {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Lütfen aranacak bir kelime girin (Örn: Frontend Developer).');
            return;
        }

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            // Append location to the query object so the backend knows
            const reqBody = { query, type: 'jobs', location: location.trim() || 'Worldwide' };

            const res = await fetch('/api/scout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody),
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
        <div className="max-w-6xl mx-auto py-12 px-8 space-y-8 bg-[#fbfbfb] min-h-[calc(100vh-100px)] text-zinc-900">
            <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Job Finder</h1>
                <p className="text-zinc-500 mt-1">Search the internet for your next opportunity.</p>
            </div>

            {/* Search Bar Container */}
            <div className="bg-white border border-zinc-200 rounded-full shadow-sm p-2 flex flex-col md:flex-row items-center gap-2 max-w-4xl">
                {/* Search Text */}
                <div className="flex-1 flex items-center relative w-full border-r border-zinc-200 pr-2">
                    <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
                    <Input
                        placeholder="Job title, keywords, or company"
                        className="w-full border-0 focus-visible:ring-0 shadow-none pl-12 h-12 text-base rounded-full bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                {/* Location */}
                <div className="flex-1 flex items-center relative w-full pr-2">
                    <MapPin className="w-5 h-5 text-zinc-400 absolute left-4" />
                    <Input
                        placeholder="Location"
                        className="w-full border-0 focus-visible:ring-0 shadow-none pl-12 h-12 text-base rounded-full bg-transparent"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                {/* Search Button */}
                <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto rounded-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 font-bold shrink-0">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Jobs"}
                </Button>
            </div>

            {error && <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 max-w-4xl">{error}</p>}

            {/* Loading Skeleton Space */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-zinc-500 animate-pulse font-medium">Scraping global job boards...</p>
                </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {results.map((r, i) => (
                        <Card key={i} className="border border-zinc-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all bg-white flex flex-col group h-full">
                            <CardContent className="p-6 flex-1 flex flex-col items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <Building className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-zinc-900 line-clamp-2 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                        {r.title}
                                    </h3>
                                    <p className="text-zinc-600 font-medium inline-flex items-center gap-1.5 mb-1">
                                        {r.companyName}
                                    </p>
                                    <p className="text-sm text-zinc-500 flex items-center gap-1.5 line-clamp-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {r.location}
                                    </p>
                                </div>
                                <div className="mt-auto w-full pt-4 border-t border-zinc-100">
                                    <a
                                        href={r.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        Apply Now
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
