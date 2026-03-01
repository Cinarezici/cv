'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CvShareLinkButton } from '@/components/CvShareLinkButton';
import { DeleteButton } from '@/components/DeleteButton';
import { CvPreviewModal } from '@/components/CvPreviewModal';
import {
    FileText, Plus, Pencil, Clock, LayoutTemplate,
    Link as LinkIcon, AlertCircle, LayoutGrid,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UnifiedDocument {
    id: string;
    type: 'resume' | 'profile';
    title: string;
    subtitle: string;
    updatedAt: string;
}

type FilterType = 'all' | 'resume' | 'profile';

const FILTERS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { value: 'resume', label: 'CVs', icon: <FileText className="w-3.5 h-3.5" /> },
    { value: 'profile', label: 'Profiles', icon: <LinkIcon className="w-3.5 h-3.5" /> },
];

interface Props {
    documents: UnifiedDocument[];
    isCVLimitReached: boolean;
}

export default function MyCVsClient({ documents, isCVLimitReached }: Props) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filtered = filter === 'all' ? documents : documents.filter(d => d.type === filter);

    const resumeCount = documents.filter(d => d.type === 'resume').length;
    const profileCount = documents.filter(d => d.type === 'profile').length;

    const countFor = (v: FilterType) =>
        v === 'all' ? documents.length : v === 'resume' ? resumeCount : profileCount;

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-8">

            {/* ─── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">My CVs</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                        {documents.length === 0
                            ? 'No documents yet. Create your first CV!'
                            : `${resumeCount} CV${resumeCount !== 1 ? 's' : ''} · ${profileCount} profile${profileCount !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* ─── Segmented Filter Pill ─── */}
                    <div className="flex items-center bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 rounded-xl p-1 gap-0.5">
                        {FILTERS.map(f => {
                            const isActive = filter === f.value;
                            return (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${isActive
                                            ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                                        }`}
                                >
                                    <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}>
                                        {f.icon}
                                    </span>
                                    {f.label}
                                    {/* Count badge */}
                                    <span className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${isActive
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                                        }`}>
                                        {countFor(f.value)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ─── New CV button ─── */}
                    <Link
                        href={isCVLimitReached ? '/upgrade' : '/builder/new'}
                        className={`inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${isCVLimitReached
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isCVLimitReached ? (
                            <><AlertCircle className="w-4 h-4" />Limit Reached</>
                        ) : (
                            <><Plus className="w-4 h-4" />New CV</>
                        )}
                    </Link>
                </div>
            </div>

            {/* ─── Grid ────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl bg-white dark:bg-zinc-900">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${filter === 'profile' ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'
                        }`}>
                        {filter === 'profile'
                            ? <LinkIcon className="w-8 h-8 text-blue-400 dark:text-blue-500" />
                            : <FileText className="w-8 h-8 text-indigo-400 dark:text-indigo-500" />}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-200">
                        {filter === 'all' ? 'No documents yet' : filter === 'resume' ? 'No CVs yet' : 'No profiles yet'}
                    </h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2 mb-6">
                        {filter === 'all' || filter === 'resume' ? 'Create your first CV using the CV Builder.' : 'Import a LinkedIn profile to get started.'}
                    </p>
                    {(filter === 'all' || filter === 'resume') && (
                        <Link
                            href={isCVLimitReached ? '/upgrade' : '/builder/new'}
                            className={`inline-flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors ${isCVLimitReached
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                        >
                            <Plus className="w-4 h-4" /> Create a CV
                        </Link>
                    )}
                    {filter === 'profile' && (
                        <Link
                            href="/import"
                            className="inline-flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <LinkIcon className="w-4 h-4" /> Import Profile
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((doc) => {
                        const editHref = doc.type === 'resume' ? `/builder/${doc.id}` : `/builder/new?profileId=${doc.id}`;
                        const isProfile = doc.type === 'profile';

                        return (
                            <div
                                key={`${doc.type}-${doc.id}`}
                                className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:shadow-white/5 transition-all duration-200 overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`h-1 ${isProfile ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} />

                                <div className="p-5 flex flex-col h-full">
                                    {/* Icon + Name */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isProfile ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
                                            {isProfile ? <LinkIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" /> : <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight line-clamp-1">{doc.title}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {isProfile ? <LinkIcon className="w-3 h-3 text-zinc-400 dark:text-zinc-500" /> : <LayoutTemplate className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />}
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">{doc.subtitle}</span>
                                            </div>
                                        </div>
                                        {/* Type badge */}
                                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isProfile
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                                                : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                                            }`}>
                                            {isProfile ? 'Profile' : 'CV'}
                                        </span>
                                    </div>

                                    {/* Updated at */}
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-5 mt-auto">
                                        <Clock className="w-3 h-3" />
                                        <span>Updated {doc.updatedAt ? formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true }) : 'recently'}</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 mt-auto">
                                        <Link
                                            href={editHref}
                                            className={`flex-1 flex items-center justify-center gap-1.5 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors ${isProfile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            {isProfile ? 'Convert to CV' : 'Edit'}
                                        </Link>
                                        {doc.type === 'resume' && (
                                            <CvPreviewModal resumeId={doc.id} title={doc.title} />
                                        )}
                                        {doc.type === 'resume' && (
                                            <CvShareLinkButton resumeId={doc.id} size="sm" variant="outline" />
                                        )}
                                        <DeleteButton id={doc.id} type={doc.type === 'resume' ? 'resumes' : 'profiles'} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
