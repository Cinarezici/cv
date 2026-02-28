import React from 'react';
import { MapPin, Building, ExternalLink, Sparkles, Clock, Users, Briefcase, Star, CheckCircle2, Circle } from 'lucide-react';

export interface Job {
    id: string;
    title: string;
    companyName: string;
    companyLogo: string | null;
    location: string;
    link: string;
    postedAt: string;
    applicantsCount: string | null;
    employmentType: string | null;
    seniorityLevel: string | null;
    descriptionText: string;
    salaryInfo: string[];
    benefits: string[];
}

interface JobCardProps {
    job: Job;
    isPro: boolean;
    isSaved?: boolean;
    isSelected?: boolean;
    onToggleSave?: (job: Job) => void;
    onToggleSelect?: (job: Job) => void;
    onOptimize: (job: Job) => void;
}

export function JobCard({ job, isPro, isSaved = false, isSelected = false, onToggleSave, onToggleSelect, onOptimize }: JobCardProps) {
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        return `${Math.floor(diff / 7)} weeks ago`;
    };

    return (
        <div className={`group bg-white dark:bg-[#0f1525] border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden ${isSelected
            ? 'border-indigo-500 shadow-indigo-100 dark:shadow-indigo-500/20 shadow-md'
            : 'border-zinc-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30'
            }`}>
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-100/40 dark:group-hover:bg-indigo-500/10 transition-colors" />

            {/* Selected overlay tint */}
            {isSelected && <div className="absolute inset-0 bg-indigo-50/20 dark:bg-indigo-500/10 pointer-events-none rounded-2xl" />}

            <div className="flex items-start gap-4 mb-4 relative z-10">
                {/* Select Toggle (top-left) */}
                {onToggleSelect && (
                    <button
                        onClick={() => onToggleSelect(job)}
                        className={`absolute top-0 left-0 z-20 p-1.5 rounded-full transition-colors ${isSelected
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-300 dark:text-zinc-600 hover:text-indigo-400 dark:hover:text-indigo-400'
                            }`}
                        title={isSelected ? 'Seçimi kaldır' : 'Seç'}
                    >
                        {isSelected
                            ? <CheckCircle2 className="w-5 h-5" fill="currentColor" />
                            : <Circle className="w-5 h-5" />
                        }
                    </button>
                )}

                {/* Logo Section */}
                <div className="w-14 h-14 rounded-xl border border-zinc-100 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-white dark:bg-white/5 relative">
                    {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain p-2" />
                    ) : (
                        <Building className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                    )}
                </div>

                {onToggleSave && (
                    <button
                        onClick={() => onToggleSave(job)}
                        className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-colors ${isSaved
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                            : 'text-zinc-400 bg-white/50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                        title={isSaved ? "Remove from saved" : "Save job"}
                    >
                        <Star className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                )}

                <div className={`flex-1 min-w-0 ${onToggleSelect ? 'pl-5' : ''}`}>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate leading-snug">
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-sm">{job.companyName}</span>
                        <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tags/Meta Section */}
            <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                {job.employmentType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-tight">
                        <Briefcase className="w-3 h-3" />
                        {job.employmentType}
                    </span>
                )}
                {job.seniorityLevel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-tight">
                        {job.seniorityLevel}
                    </span>
                )}
                {job.salaryInfo && job.salaryInfo.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-tight">
                        💰 {job.salaryInfo.join(' - ')}
                    </span>
                )}
            </div>

            {/* Description Preview */}
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 relative z-10 flex-1">
                {job.descriptionText}
            </p>

            {/* Footer / Stats */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-white/10 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest relative z-10">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(job.postedAt)}
                    </span>
                    {job.applicantsCount && (
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {job.applicantsCount} Applicants
                        </span>
                    )}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
                <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors border border-zinc-200 dark:border-white/10"
                >
                    View on LinkedIn
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                    onClick={() => onOptimize(job)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 ${isPro
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
                        }`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isPro ? "Optimize CV" : "Optimize CV 🔒"}
                </button>
            </div>
        </div>
    );
}
