'use client';

import Link from 'next/link';
import { Sparkles, Check, Zap } from 'lucide-react';

interface Feature {
    text: string;
}

interface LockedPageViewProps {
    featureName: string;
    subtitle?: string;
    features?: Feature[];
}

const DEFAULT_FEATURES: Feature[] = [
    { text: 'Unlimited CV creation & editing' },
    { text: 'Export CV to PDF & DOCX' },
    { text: 'Unlimited LinkedIn job searches' },
    { text: 'Unlimited cover letters & PDFs' },
    { text: '6 Premium Resume Templates' },
    { text: 'AI-powered interview prep (Coming soon)' },
];

export default function LockedPageView({
    featureName,
    subtitle = 'This feature requires a Pro Plan subscription.',
    features = DEFAULT_FEATURES,
}: LockedPageViewProps) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-10">
            <div className="w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">

                {/* ── Orange gradient header ──────────────────────── */}
                <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 px-8 pt-10 pb-12 flex flex-col items-center text-center overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <text x="120" y="120" fontSize="140" fill="white" fontWeight="900" opacity="0.3">✦</text>
                            <text x="-20" y="80" fontSize="100" fill="white" fontWeight="900" opacity="0.2">✦</text>
                        </svg>
                    </div>

                    {/* Icon */}
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-5 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="relative text-2xl font-extrabold text-white tracking-tight mb-2">
                        Pro Feature
                    </h1>
                    <p className="relative text-orange-100 text-sm font-medium">
                        {featureName} is a Premium feature.
                    </p>
                </div>

                {/* ── Card body ──────────────────────────────────── */}
                <div className="px-8 pt-7 pb-8 space-y-6">
                    <p className="text-center font-extrabold text-zinc-900 dark:text-white text-[17px] leading-snug">
                        Upgrade your plan to unlock<br />all Pro features.
                    </p>

                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-zinc-600 dark:text-zinc-400 text-[13px] font-medium leading-tight">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pricing note */}
                    <div className="text-center py-2">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                            One-time · <span className="font-bold text-zinc-600 dark:text-zinc-300">$99</span> for 3 years · ≈ <span className="text-orange-500 font-bold">$2.75/mo</span>
                        </p>
                    </div>

                    {/* Upgrade CTA */}
                    <Link
                        href="/upgrade"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-200 dark:shadow-orange-900/25 transition-all active:scale-[0.98]"
                    >
                        <Zap className="w-4 h-4" />
                        Upgrade to Pro
                    </Link>

                    {/* Back */}
                    <div className="text-center">
                        <Link
                            href="/dashboard"
                            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors font-medium"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
