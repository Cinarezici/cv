import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Resume } from '@/types';
import { DeleteButton } from '@/components/DeleteButton';
import { CvShareLinkButton } from '@/components/CvShareLinkButton';
import { CvPreviewModal } from '@/components/CvPreviewModal';
import { FileText, Mail, Plus, Pencil, Clock, LayoutTemplate, Zap, Link as LinkIcon, AlertCircle, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { checkUsageLimits } from '@/lib/limits';
import { getEffectiveStatus } from '@/lib/subscription';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

    // Check subscription status — canceled users see locked dashboard
    const subStatus = await getEffectiveStatus(user.id);
    if (subStatus === 'canceled') {
        return <LockedDashboard />;
    }

    const limitCheck = await checkUsageLimits(user.id, 'create_cv');
    const isCVLimitReached = !limitCheck.allowed;

    const [{ data: resumes }, { data: profiles }, { data: letters }] = await Promise.all([
        supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
        supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
        supabase
            .from('motivation_letters')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
    ]);

    const documents = [];

    if (profiles) {
        documents.push(...profiles.map(p => ({
            id: p.id,
            type: 'profile' as const,
            title: p.full_name ? `${p.full_name} — CV'im` : 'LinkedIn Bağlantısı',
            subtitle: p.headline || 'İçe Aktarılan Profil',
            updatedAt: p.updated_at
        })));
    }

    if (resumes) {
        documents.push(...resumes.map(r => ({
            id: r.id,
            type: 'resume' as const,
            title: r.job_title || 'İsimsiz CV',
            subtitle: r.theme_category ? `Tema: ${r.theme_category}` : 'Standart',
            updatedAt: r.updated_at
        })));
    }

    documents.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
    });

    const totalDocs = documents.length + (letters?.length || 0);
    const cvsCreated = documents.length;
    const coverLetters = letters?.length || 0;

    const recentCVs = documents.slice(0, 5);

    const recentLetters = letters?.slice(0, 3) || [];

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8">

            {/* ─── Header ────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage your CVs and cover letters.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Link
                        href="/upgrade"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                    >
                        <Zap className="w-4 h-4" />
                        Upgrade Pro
                    </Link>
                    <Link
                        href={isCVLimitReached ? "/upgrade" : "/builder/new"}
                        className={`inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${isCVLimitReached
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                            }`}
                    >
                        {isCVLimitReached ? (
                            <>
                                <AlertCircle className="w-4 h-4" />
                                Limit Reached
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                CV Builder
                            </>
                        )}
                    </Link>
                </div>
            </div>

            {/* ─── Stat Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    icon={<LayoutTemplate className="w-5 h-5 text-indigo-500" />}
                    iconBg="bg-indigo-50"
                    value={totalDocs}
                    label="TOTAL DOCUMENTS"
                />
                <StatCard
                    icon={<FileText className="w-5 h-5 text-emerald-500" />}
                    iconBg="bg-emerald-50"
                    value={cvsCreated}
                    label="CVS CREATED"
                />
                <StatCard
                    icon={<Mail className="w-5 h-5 text-violet-500" />}
                    iconBg="bg-violet-50"
                    value={coverLetters}
                    label="COVER LETTERS"
                />
            </div>

            {/* ─── Recent CVs ────────────────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Recent CVs</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Sorted by last updated</span>
                        <Link href="/my-cvs" className="text-xs font-bold text-indigo-600 dark:text-blue-400 hover:text-indigo-800 dark:hover:text-blue-300 transition-colors">
                            View All
                        </Link>
                    </div>
                </div>

                {recentCVs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="w-8 h-8 text-zinc-200 dark:text-zinc-700 mb-3" />
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">No CVs yet. Create your first CV!</p>
                        <Link
                            href="/my-cvs"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus className="w-4 h-4" /> Create CV
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-white/5">
                        {recentCVs.map((doc) => {
                            const isProfile = doc.type === 'profile';
                            const editHref = isProfile ? `/builder/new?profileId=${doc.id}` : `/builder/${doc.id}`;

                            return (
                                <div key={`${doc.type}-${doc.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                                    <Link href="/my-cvs" className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isProfile ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
                                            {isProfile ? <LinkIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" /> : <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{doc.title}</p>
                                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                                                {isProfile ? <LinkIcon className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" /> : <LayoutTemplate className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" />}
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">{doc.subtitle}</span>
                                                <span className="text-zinc-300 dark:text-zinc-700 text-xs hidden sm:inline">•</span>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                                    {doc.updatedAt ? `${formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}` : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={editHref}
                                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors border shadow-sm ${isProfile
                                                ? 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-transparent hover:bg-blue-100 dark:hover:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
                                                : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-transparent hover:bg-indigo-100 dark:hover:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/30'
                                                }`}
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> {isProfile ? "Convert" : 'Edit'}
                                        </Link>
                                        {!isProfile && (
                                            <CvPreviewModal resumeId={doc.id} title={doc.title} />
                                        )}
                                        {!isProfile && (
                                            <CvShareLinkButton resumeId={doc.id} size="sm" variant="outline" />
                                        )}
                                        <DeleteButton id={doc.id} type={isProfile ? 'profiles' : 'resumes'} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ─── Recent Cover Letters ──────────────────────────────── */}
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mt-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">Recent Cover Letters</h2>
                    <Link href="/motivation-letters" className="text-xs font-bold text-indigo-600 dark:text-blue-400 hover:text-indigo-800 dark:hover:text-blue-300 transition-colors">
                        View All
                    </Link>
                </div>

                {recentLetters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Mail className="w-8 h-8 text-zinc-200 dark:text-zinc-700 mb-3" />
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">No cover letters yet.</p>
                        <Link
                            href="/motivation-letters"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus className="w-4 h-4" /> Create Letter
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-white/5">
                        {recentLetters.map((letter: any) => (
                            <div key={letter.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1">
                                        {letter.job_title || 'Untitled Position'}
                                        {letter.company_name ? `, ${letter.company_name}` : ''}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {letter.company_name || 'No company'} • {formatDistanceToNow(new Date(letter.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/motivation-letters/${letter.id}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5"
                                    >
                                        <Pencil className="w-3 h-3" /> View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function StatCard({ icon, iconBg, value, label }: { icon: React.ReactNode; iconBg: string; value: number; label: string }) {
    // Modify iconBg for dark mode: Extract the color part (e.g., 'indigo' from 'bg-indigo-50')
    const colorMatch = iconBg.match(/bg-([a-z]+)-50/);
    const color = colorMatch ? colorMatch[1] : 'zinc';
    const darkBgClass = `dark:bg-${color}-500/10`;

    return (
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm p-6 flex items-center gap-5`}>
            <div className={`w-12 h-12 rounded-xl ${iconBg} ${darkBgClass} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">{value}</div>
                <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
        </div>
    );
}

/* ─── Locked Dashboard (shown to canceled users) ──────────────── */
function LockedDashboard() {
    const LOCKED_FEATURES = [
        'Unlimited CV creation & editing',
        'Unlimited LinkedIn job searches',
        'Unlimited motivation letters',
        'PDF export for all letters & CVs',
        'Share links always stay active',
        'AI-powered CV optimization',
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-8">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-200 dark:shadow-orange-500/10">
                <Lock className="w-10 h-10 text-white" />
            </div>

            {/* Heading */}
            <div className="space-y-3 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest border border-amber-200 dark:border-amber-500/20">
                    Trial Ended
                </div>
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Your free trial has ended
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                    Upgrade to Pro to regain access to your CVs, letters, and all features. Your data is safe and waiting for you.
                </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full text-left">
                {LOCKED_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {f}
                    </div>
                ))}
            </div>

            {/* Pricing */}
            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-8 py-5 max-w-sm w-full">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Pro Plan</p>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">$99 <span className="text-base font-semibold text-zinc-400">/ 3 years</span></p>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold mt-1">≈ $2.75/month — less than a coffee</p>
            </div>

            {/* CTA */}
            <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold px-10 py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95 text-sm"
            >
                <Zap className="w-4 h-4" />
                Upgrade to Pro — $99 lifetime
            </Link>
        </div>
    );
}

