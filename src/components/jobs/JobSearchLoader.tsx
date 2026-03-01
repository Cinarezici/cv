'use client';

import { useState, useEffect } from 'react';

const STEPS = [
    { label: 'Connecting to LinkedIn...', sub: 'Establishing secure channel' },
    { label: 'Scanning job boards...', sub: 'Fetching real-time listings' },
    { label: 'Filtering opportunities...', sub: 'Matching your keywords' },
    { label: 'Ranking results...', sub: 'Sorting by relevance' },
    { label: 'Almost there...', sub: 'Preparing your results' },
];

interface JobSearchLoaderProps {
    keywords?: string;
    location?: string;
}

export function JobSearchLoader({ keywords, location }: JobSearchLoaderProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const [dots, setDots] = useState('');
    const [elapsed, setElapsed] = useState(0);

    // Cycle through status steps every ~8s
    useEffect(() => {
        const id = setInterval(() => {
            setStepIndex(i => (i + 1) % STEPS.length);
        }, 8000);
        return () => clearInterval(id);
    }, []);

    // Animated dots
    useEffect(() => {
        const id = setInterval(() => {
            setDots(d => (d.length >= 3 ? '' : d + '.'));
        }, 500);
        return () => clearInterval(id);
    }, []);

    // Elapsed timer
    useEffect(() => {
        setElapsed(0);
        const id = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const step = STEPS[stepIndex];

    return (
        <div className="flex flex-col items-center justify-center py-20 select-none">
            {/* ── Orbital ring animation ──────────────────────────────── */}
            <div className="relative w-36 h-36 mb-10">
                {/* Outermost ring */}
                <div
                    className="absolute inset-0 rounded-full border-2 border-indigo-200/40 dark:border-indigo-500/20"
                    style={{ animation: 'spin 10s linear infinite' }}
                />
                {/* Middle ring */}
                <div
                    className="absolute inset-3 rounded-full border-2 border-violet-300/50 dark:border-violet-500/30"
                    style={{ animation: 'spin 7s linear infinite reverse' }}
                />
                {/* Inner ring */}
                <div
                    className="absolute inset-6 rounded-full border-2 border-indigo-400/60 dark:border-indigo-400/50"
                    style={{ animation: 'spin 4s linear infinite' }}
                />

                {/* Orbiting dot — outer */}
                <div
                    className="absolute w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/50"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 -68px',
                        transform: 'translateX(-50%) translateY(-50%)',
                        animation: 'orbit-outer 3s linear infinite',
                    }}
                />
                {/* Orbiting dot — middle */}
                <div
                    className="absolute w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full shadow-md shadow-violet-500/40"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 -48px',
                        transform: 'translateX(-50%) translateY(-50%)',
                        animation: 'orbit-middle 5s linear infinite reverse',
                    }}
                />

                {/* Center core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 dark:shadow-indigo-500/20">
                            {/* LinkedIn-style magnifier */}
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <circle cx="11" cy="11" r="7" />
                                <path strokeLinecap="round" d="M20 20l-3-3" />
                            </svg>
                        </div>
                        {/* Pulse rings */}
                        <div
                            className="absolute inset-0 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20"
                            style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Search query chip ─────────────────────────────────── */}
            {keywords && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <circle cx="11" cy="11" r="7" />
                        <path strokeLinecap="round" d="M20 20l-3-3" />
                    </svg>
                    <span>&ldquo;{keywords}&rdquo;</span>
                    {location && <><span className="opacity-40">·</span><span className="opacity-70 font-medium">{location}</span></>}
                </div>
            )}

            {/* ── Status message ────────────────────────────────────── */}
            <div className="text-center space-y-2 mb-8">
                <h3
                    key={stepIndex}
                    className="text-xl font-bold text-zinc-900 dark:text-white"
                    style={{ animation: 'fadeInUp 0.4s ease' }}
                >
                    {step.label}<span className="text-indigo-500 dark:text-indigo-400">{dots}</span>
                </h3>
                <p
                    key={`sub-${stepIndex}`}
                    className="text-sm text-zinc-500 dark:text-zinc-400 font-medium"
                    style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}
                >
                    {step.sub}
                </p>
            </div>

            {/* ── Progress bar ──────────────────────────────────────── */}
            <div className="w-64 h-1 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ animation: 'progress 60s linear forwards' }}
                />
            </div>

            {/* ── Step indicators ───────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-6">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-500 ${i === stepIndex
                                ? 'w-5 h-1.5 bg-indigo-500 dark:bg-indigo-400'
                                : i < stepIndex
                                    ? 'w-1.5 h-1.5 bg-indigo-300 dark:bg-indigo-600'
                                    : 'w-1.5 h-1.5 bg-zinc-200 dark:bg-white/10'
                            }`}
                    />
                ))}
            </div>

            {/* ── Elapsed time ──────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Scraping LinkedIn live · {elapsed}s elapsed · usually 20–60s
            </div>

            {/* ── Keyframe style block ──────────────────────────────── */}
            <style>{`
                @keyframes orbit-outer {
                    from { transform: translateX(-50%) translateY(-50%) rotate(0deg) translateY(-68px) rotate(0deg); }
                    to   { transform: translateX(-50%) translateY(-50%) rotate(360deg) translateY(-68px) rotate(-360deg); }
                }
                @keyframes orbit-middle {
                    from { transform: translateX(-50%) translateY(-50%) rotate(0deg) translateY(-48px) rotate(0deg); }
                    to   { transform: translateX(-50%) translateY(-50%) rotate(360deg) translateY(-48px) rotate(-360deg); }
                }
                @keyframes progress {
                    from { width: 0%; }
                    to   { width: 90%; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes ping {
                    0%   { transform: scale(1); opacity: 0.8; }
                    75%, 100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
