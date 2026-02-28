import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';

const QUICK_LOCATIONS = ['Remote', 'Istanbul', 'Ankara', 'London', 'Berlin', 'New York'];

interface JobSearchFormProps {
    onSearch: (keywords: string, location: string) => void;
    isLoading: boolean;
}

export function JobSearchForm({ onSearch, isLoading }: JobSearchFormProps) {
    const [keywords, setKeywords] = useState('');
    const [location, setLocation] = useState('Remote');

    useEffect(() => {
        const lastKeywords = localStorage.getItem('lastJobKeywords');
        const lastLocation = localStorage.getItem('lastJobLocation');
        if (lastKeywords) setKeywords(lastKeywords);
        if (lastLocation) setLocation(lastLocation);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (keywords.trim().length < 2 || isLoading) return;

        localStorage.setItem('lastJobKeywords', keywords);
        localStorage.setItem('lastJobLocation', location);
        onSearch(keywords, location);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <form
                onSubmit={handleSearch}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm p-2 flex flex-col md:flex-row items-center gap-2"
            >
                {/* Keywords Input */}
                <div className="flex-1 flex items-center relative w-full border-b md:border-b-0 md:border-r border-zinc-100 dark:border-white/10 pr-2 group">
                    <Search className="w-5 h-5 text-zinc-400 absolute left-4 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="w-full border-0 focus:ring-0 pl-12 h-12 text-sm md:text-base rounded-full bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        disabled={isLoading}
                    />
                    {keywords && (
                        <button
                            type="button"
                            onClick={() => setKeywords('')}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full mr-2"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                </div>

                {/* Location Input */}
                <div className="flex-1 flex items-center relative w-full group">
                    <MapPin className="w-5 h-5 text-zinc-400 absolute left-4 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full border-0 focus:ring-0 pl-12 h-12 text-sm md:text-base rounded-full bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isLoading || keywords.trim().length < 2}
                    className="w-full md:w-auto h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900 text-white font-bold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            <span>Search Jobs</span>
                        </>
                    )}
                </button>
            </form>

            {/* Quick Selects */}
            <div className="flex flex-wrap items-center gap-2 px-4 justify-center md:justify-start">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1">Popular:</span>
                {QUICK_LOCATIONS.map((loc) => (
                    <button
                        key={loc}
                        type="button"
                        onClick={() => setLocation(loc)}
                        disabled={isLoading}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${location === loc
                            ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                            : "bg-white dark:bg-transparent border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
                            }`}
                    >
                        {loc}
                    </button>
                ))}
            </div>
        </div>
    );
}
