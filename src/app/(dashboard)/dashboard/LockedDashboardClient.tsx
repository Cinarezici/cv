'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FileText, Mail, Zap, Clock, LayoutTemplate, Lock, Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TrialExpiredModal } from '@/components/TrialExpiredModal';

interface DocItem {
    id: string;
    type: 'resume' | 'profile';
    title: string;
    subtitle: string;
    updatedAt: string;
}

interface LetterItem {
    id: string;
    company_name: string;
    target_role?: string;
    created_at: string;
}

interface Props {
    recentCVs: DocItem[];
    recentLetters: LetterItem[];
    totalDocs: number;
    cvsCreated: number;
    coverLetters: number;
}

export default function LockedDashboardClient({
    recentCVs, recentLetters, totalDocs, cvsCreated, coverLetters
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    const fireModal = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8 select-none">

            {/* ── Modal ─────────────────────────────────────────── */}
            <TrialExpiredModal open={modalOpen} onClose={() => setModalOpen(false)} />

            {/* ── Header with locked banner ─────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25 uppercase tracking-widest">
                            <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your trial has ended. Upgrade to regain full access.</p>
                </div>
                {/* Only clickable button */}
                <Link
                    href="/upgrade"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm"
                >
                    <Zap className="w-4 h-4" />
                    Upgrade to Pro
                </Link>
            </div>

            {/* ── Stat cards (blurred) ───────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { icon: <LayoutTemplate className="w-5 h-5 text-indigo-400" />, bg: 'bg-indigo-50 dark:bg-indigo-500/10', value: totalDocs, label: 'TOTAL DOCUMENTS' },
                    { icon: <FileText className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-50 dark:bg-emerald-500/10', value: cvsCreated, label: 'CVS CREATED' },
                    { icon: <Mail className="w-5 h-5 text-violet-400" />, bg: 'bg-violet-50 dark:bg-violet-500/10', value: coverLetters, label: 'COVER LETTERS' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm p-6 flex items-center gap-5 opacity-60">
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
                        <div>
                            <div className="text-3xl font-extrabold text-zinc-700 dark:text-zinc-300">{s.value}</div>
                            <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Locked upgrade banner ─────────────────────────── */}
            <div
                className="relative overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-500/25 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 p-6 flex flex-col sm:flex-row items-center gap-5"
            >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                    <Lock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-lg mb-1">Your free trial has ended</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your CVs and letters are safe. Upgrade to Pro to access them again.</p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-1">≈ $2.75/month · $99 for 3 years · one-time payment</p>
                </div>
                <Link
                    href="/upgrade"
                    className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
                >
                    <Zap className="w-4 h-4" /> Upgrade Now
                </Link>
            </div>

            {/* ── Recent CVs — locked ───────────────────────────── */}
            {recentCVs.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                            Recent CVs
                            <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                        </h2>
                        <button
                            onClick={fireModal}
                            className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="space-y-2">
                        {recentCVs.map(doc => (
                            <div
                                key={doc.id}
                                role="button"
                                tabIndex={0}
                                onClick={fireModal}
                                onKeyDown={e => e.key === 'Enter' && fireModal(e)}
                                className="group relative flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3.5 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-sm transition-all"
                            >
                                {/* Lock icon overlay */}
                                <div className="absolute inset-0 rounded-xl flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/25">
                                        <Lock className="w-2.5 h-2.5" /> Unlock Pro
                                    </span>
                                </div>

                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 opacity-50 ${doc.type === 'resume' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
                                    <FileText className={`w-4 h-4 ${doc.type === 'resume' ? 'text-indigo-500' : 'text-blue-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0 opacity-60">
                                    <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300 truncate">{doc.title}</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{doc.subtitle}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 shrink-0 opacity-60">
                                    <Clock className="w-3 h-3" />
                                    <span>{doc.updatedAt ? formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true }) : '—'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Recent Letters — locked ───────────────────────── */}
            {recentLetters.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                            Recent Cover Letters
                            <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentLetters.map(letter => (
                            <div
                                key={letter.id}
                                role="button"
                                tabIndex={0}
                                onClick={fireModal}
                                onKeyDown={e => e.key === 'Enter' && fireModal(e)}
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-4 cursor-pointer hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-sm transition-all"
                            >
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="w-3.5 h-3.5 text-violet-400" />
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-3 opacity-50">
                                    <Sparkles className="w-4 h-4 text-violet-500" />
                                </div>
                                <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300 truncate opacity-60">{letter.company_name}</p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate opacity-50 mt-0.5">{letter.target_role || '—'}</p>
                                <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 mt-3 opacity-50">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(letter.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {recentCVs.length === 0 && recentLetters.length === 0 && (
                <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-sm">
                    No documents yet. Upgrade to Pro to start creating CVs and letters.
                </div>
            )}
        </div>
    );
}
