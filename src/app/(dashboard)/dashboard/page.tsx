import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Resume } from '@/types';
import { DeleteButton } from '@/components/DeleteButton';
import { CvShareLinkButton } from '@/components/CvShareLinkButton';
import { FileText, Mail, Plus, Pencil, Clock, LayoutTemplate, Zap, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

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
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Dashboard</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Manage your CVs and cover letters.</p>
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
                        href="/builder/new"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        + CV Builder
                    </Link>
                </div>
            </div>

            {/* ─── Stat Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    icon={<FileText className="w-5 h-5 text-indigo-500" />}
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
            <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h2 className="text-base font-bold text-zinc-900">Recent CVs</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-medium">Sorted by last updated</span>
                        <Link href="/my-cvs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            View All
                        </Link>
                    </div>
                </div>

                {recentCVs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="w-8 h-8 text-zinc-200 mb-3" />
                        <p className="text-sm text-zinc-400 font-medium">No CVs yet. Create your first CV!</p>
                        <Link
                            href="/my-cvs"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus className="w-4 h-4" /> Create CV
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {recentCVs.map((doc) => {
                            const isProfile = doc.type === 'profile';
                            const editHref = isProfile ? `/builder/new?profileId=${doc.id}` : `/builder/${doc.id}`;

                            return (
                                <div key={`${doc.type}-${doc.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isProfile ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                                        {isProfile ? <LinkIcon className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-indigo-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-zinc-900 text-sm leading-tight">{doc.title}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {isProfile ? <LinkIcon className="w-3 h-3 text-zinc-400" /> : <LayoutTemplate className="w-3 h-3 text-zinc-400" />}
                                            <span className="text-xs text-zinc-500 truncate max-w-[150px]">{doc.subtitle}</span>
                                            <span className="text-zinc-300 text-xs">•</span>
                                            <Clock className="w-3 h-3 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">
                                                {doc.updatedAt ? `Updated ${formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}` : 'Recently'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={editHref}
                                            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${isProfile ? 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100' : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'}`}
                                        >
                                            <Pencil className="w-3 h-3" /> {isProfile ? "Convert" : 'Edit'}
                                        </Link>
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
            <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h2 className="text-base font-bold text-zinc-900">Recent Cover Letters</h2>
                    <Link href="/motivation-letters" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View All
                    </Link>
                </div>

                {recentLetters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Mail className="w-8 h-8 text-zinc-200 mb-3" />
                        <p className="text-sm text-zinc-400 font-medium">No cover letters yet.</p>
                        <Link
                            href="/motivation-letters"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus className="w-4 h-4" /> Create Letter
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {recentLetters.map((letter: any) => (
                            <div key={letter.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-violet-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-zinc-900 text-sm leading-tight line-clamp-1">
                                        {letter.job_title || 'Untitled Position'}
                                        {letter.company_name ? `, ${letter.company_name}` : ''}
                                    </p>
                                    {letter.company_name && (
                                        <p className="text-xs text-zinc-500 mt-0.5">{letter.company_name}</p>
                                    )}
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
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-extrabold text-zinc-900">{value}</div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
        </div>
    );
}
