import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CvShareLinkButton } from '@/components/CvShareLinkButton';
import { DeleteButton } from '@/components/DeleteButton';
import { FileText, Plus, Pencil, Clock, LayoutTemplate, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { checkUsageLimits } from '@/lib/limits';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UnifiedDocument {
    id: string;
    type: 'resume' | 'profile';
    title: string;
    subtitle: string;
    updatedAt: string;
}

export default async function MyCVsPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    const limitCheck = await checkUsageLimits(user.id, 'create_cv');
    const isCVLimitReached = !limitCheck.allowed;

    const [{ data: resumes }, { data: profiles }] = await Promise.all([
        supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
        supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
    ]);

    const documents: UnifiedDocument[] = [];

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

    // Sort combined by updated_at descending, handling null/invalid dates gracefully
    documents.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">My CVs</h1>
                    <p className="text-zinc-500 mt-1 text-sm">All your created CVs. Edit, share, or delete them.</p>
                </div>
                <Link
                    href={isCVLimitReached ? "/upgrade" : "/builder/new"}
                    className={`inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${isCVLimitReached
                            ? "bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200"
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
                            New CV
                        </>
                    )}
                </Link>
            </div>

            {/* Grid */}
            {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-200 rounded-2xl bg-white">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-700">No CVs yet</h3>
                    <p className="text-zinc-400 text-sm mt-2 mb-6">Create your first CV using the CV Builder.</p>
                    <Link
                        href={isCVLimitReached ? "/upgrade" : "/builder/new"}
                        className={`inline-flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors ${isCVLimitReached
                                ? "bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200"
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
                                Create a CV
                            </>
                        )}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {documents.map((doc) => {
                        const editHref = doc.type === 'resume' ? `/builder/${doc.id}` : `/builder/new?profileId=${doc.id}`;
                        const isProfile = doc.type === 'profile';

                        return (
                            <div
                                key={`${doc.type}-${doc.id}`}
                                className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`h-1 ${isProfile ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} />

                                <div className="p-5 flex flex-col h-full">
                                    {/* Icon + Name */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isProfile ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                                            {isProfile ? <LinkIcon className="w-5 h-5 text-blue-500" /> : <FileText className="w-5 h-5 text-indigo-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-zinc-900 text-base leading-tight line-clamp-1">{doc.title}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {isProfile ? <LinkIcon className="w-3 h-3 text-zinc-400" /> : <LayoutTemplate className="w-3 h-3 text-zinc-400" />}
                                                <span className="text-xs text-zinc-500 font-medium truncate">{doc.subtitle}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Updated at */}
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-5 mt-auto">
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
                                            {isProfile ? "Convert to CV" : 'Edit'}
                                        </Link>
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
