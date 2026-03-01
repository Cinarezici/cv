'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Sparkles, FileText, Search, Mail, Link as LinkIcon, Download } from 'lucide-react';

const MONTHLY_COST = (99 / 36).toFixed(2); // $2.75/month

const PRO_FEATURES = [
    { icon: <FileText className="w-4 h-4 text-indigo-400" />, text: 'Unlimited CVs and profiles' },
    { icon: <Search className="w-4 h-4 text-indigo-400" />, text: 'Unlimited LinkedIn job searches' },
    { icon: <Mail className="w-4 h-4 text-indigo-400" />, text: 'Unlimited cover letters' },
    { icon: <Download className="w-4 h-4 text-indigo-400" />, text: 'PDF export on all letters & CVs' },
    { icon: <LinkIcon className="w-4 h-4 text-indigo-400" />, text: 'Share links always open — never expire' },
    { icon: <Sparkles className="w-4 h-4 text-indigo-400" />, text: 'AI-powered CV optimization, unlimited' },
];

interface TrialExpiredModalProps {
    open?: boolean;
    onClose?: () => void;
}

export function TrialExpiredModal({ open: controlledOpen, onClose }: TrialExpiredModalProps = {}) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);

    // Open via custom event (dispatched by requirePro / canceled API responses)
    useEffect(() => {
        const handler = () => setInternalOpen(true);
        window.addEventListener('trial-expired', handler);
        return () => window.removeEventListener('trial-expired', handler);
    }, []);

    // Also open if URL has ?locked=1
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const close = () => {
        setInternalOpen(false);
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={close}
        >
            <div
                className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                {/* Close */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="px-8 pt-8 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-orange-200 dark:shadow-orange-500/10">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
                        Your trial has ended
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                        Your 14-day free trial is over. Upgrade to Pro to keep all your CVs, letters, and share links active.
                    </p>
                </div>

                {/* Features */}
                <div className="px-8 py-5 bg-zinc-50 dark:bg-white/[0.03] border-y border-zinc-100 dark:border-white/5">
                    <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                        What you unlock with Pro
                    </p>
                    <ul className="space-y-3">
                        {PRO_FEATURES.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    {f.icon}
                                </span>
                                {f.text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pricing + CTA */}
                <div className="px-8 py-6 space-y-3">
                    <div className="text-center mb-1">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            One-time payment · <span className="text-zinc-900 dark:text-white font-bold">$99</span> for 3 years
                        </p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                            That's just <strong>${MONTHLY_COST}/month</strong> — less than a coffee.
                        </p>
                    </div>
                    <button
                        onClick={() => { close(); router.push('/upgrade'); }}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-[0.98]"
                    >
                        Upgrade to Pro →
                    </button>
                    <button
                        onClick={close}
                        className="w-full py-3 rounded-2xl text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

/**
 * Hook — opens the trial-expired modal when called.
 * Use this in any button onClick where canceled users must be gated.
 */
export function useTrialExpiredModal() {
    const fireModal = () => {
        window.dispatchEvent(new CustomEvent('trial-expired'));
    };
    return { fireModal };
}
