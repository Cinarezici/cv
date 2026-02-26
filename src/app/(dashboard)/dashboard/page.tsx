import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Resume } from '@/types';
import { DeleteButton } from '@/components/DeleteButton';
import { CvShareLinkButton } from '@/components/CvShareLinkButton';
import { FileText, Mail, Plus, Pencil, Clock, LayoutTemplate, Zap, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { checkUsageLimits } from '@/lib/limits';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

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
        <div className="max-w-6xl mx-auto py-8 px-6 space-y-10 min-h-[calc(100vh-4rem)]">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none bg-background -z-10 selection:bg-primary/20"></div>
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            {/* ─── Header ────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        Yönetim <span className="text-gradient">Paneli</span>
                    </h1>
                    <p className="text-foreground/60 mt-2 text-sm md:text-base">CV'lerini yönet, profesyonel belgelerini tek bir yerden kontrol et.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/upgrade"
                        className="inline-flex items-center gap-2 glass border-primary/20 hover:border-primary/50 text-foreground font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-primary/20 transition-all text-sm"
                    >
                        <Zap className="w-4 h-4 text-primary" />
                        Pro'ya Yükselt
                    </Link>
                    <Link
                        href={isCVLimitReached ? "/upgrade" : "/builder/new"}
                        className={`inline-flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all text-sm ${isCVLimitReached
                                ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:scale-105 shadow-primary/30"
                            }`}
                    >
                        {isCVLimitReached ? (
                            <>
                                <AlertCircle className="w-4 h-4" />
                                Limit Doldu
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Yeni CV Oluştur
                            </>
                        )}
                    </Link>
                </div>
            </div>

            {/* ─── Stat Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<LayoutTemplate className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
                    iconBg="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20"
                    value={totalDocs}
                    label="TOPLAM BELGE"
                />
                <StatCard
                    icon={<FileText className="w-6 h-6 text-primary" />}
                    iconBg="bg-primary/10 border border-primary/20"
                    value={cvsCreated}
                    label="OLUŞTURULAN CV"
                />
                <StatCard
                    icon={<Mail className="w-6 h-6 text-violet-500 dark:text-violet-400" />}
                    iconBg="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20"
                    value={coverLetters}
                    label="ÖN YAZILAR"
                />
            </div>

            {/* ─── Recent CVs ────────────────────────────────────────── */}
            <section className="glass-card rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
                    <h2 className="text-lg font-bold text-foreground">Son CV'ler</h2>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block text-xs text-foreground/40 font-medium">Son güncellenmeye göre sıralı</span>
                        <Link href="/my-cvs" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                            Tümünü Gör
                        </Link>
                    </div>
                </div>

                {recentCVs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-primary/60" />
                        </div>
                        <p className="text-foreground/60 font-medium mb-6">Henüz CV oluşturmadın. Kariyerine şimdi yatırım yap!</p>
                        <Link
                            href="/builder/new"
                            className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" /> İlk CV'ni Oluştur
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {recentCVs.map((doc) => {
                            const isProfile = doc.type === 'profile';
                            const editHref = isProfile ? `/builder/new?profileId=${doc.id}` : `/builder/${doc.id}`;

                            return (
                                <div key={`${doc.type}-${doc.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 hover:bg-foreground/[0.02] transition-colors">
                                    <div className="flex items-center gap-5 min-w-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${isProfile ? 'bg-blue-50/50 border-blue-200/50 dark:bg-blue-900/20 dark:border-blue-900/50' : 'bg-primary/10 border-primary/20'}`}>
                                            {isProfile ? <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <FileText className="w-5 h-5 text-primary" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-foreground truncate text-base">{doc.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {isProfile ? <LinkIcon className="w-3.5 h-3.5 text-foreground/40" /> : <LayoutTemplate className="w-3.5 h-3.5 text-foreground/40" />}
                                                <span className="text-xs text-foreground/50 truncate max-w-[200px]">{doc.subtitle}</span>
                                                <span className="text-border text-xs">•</span>
                                                <Clock className="w-3.5 h-3.5 text-foreground/40" />
                                                <span className="text-xs text-foreground/50">
                                                    {doc.updatedAt ? formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true }) : 'Yakın zamanda'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-17 sm:ml-0">
                                        <Link
                                            href={editHref}
                                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors border shadow-sm ${isProfile
                                                    ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40 dark:border-blue-800/60 dark:hover:bg-blue-900/60'
                                                    : 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/20'
                                                }`}
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> {isProfile ? "Dönüştür" : 'Düzenle'}
                                        </Link>
                                        {!isProfile && (
                                            <CvShareLinkButton resumeId={doc.id} size="sm" variant="outline" />
                                        )}
                                        <div className="ml-1">
                                            <DeleteButton id={doc.id} type={isProfile ? 'profiles' : 'resumes'} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ─── Recent Cover Letters ──────────────────────────────── */}
            <section className="glass-card rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
                    <h2 className="text-lg font-bold text-foreground">Son Ön Yazılar</h2>
                    <Link href="/motivation-letters" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                        Tümünü Gör
                    </Link>
                </div>

                {recentLetters.length === 0 ? (
                    <div className="flex items-center justify-between px-8 py-8 border-t border-border/10">
                        <div className="flex items-center gap-4 text-foreground/60">
                            <Mail className="w-5 h-5 opacity-50" />
                            <span className="text-sm">Henüz bir ön yazı oluşturmadın.</span>
                        </div>
                        <Link
                            href="/motivation-letters"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary/80 border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Oluştur
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {recentLetters.map((letter: any) => (
                            <div key={letter.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 hover:bg-foreground/[0.02] transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl border border-violet-200/50 bg-violet-50/50 dark:border-violet-900/50 dark:bg-violet-900/20 flex items-center justify-center shrink-0 shadow-sm">
                                        <Mail className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-foreground text-base truncate">
                                            {letter.job_title || 'İsimsiz Pozisyon'}
                                            {letter.company_name ? ` @ ${letter.company_name}` : ''}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3.5 h-3.5 text-foreground/40" />
                                            <span className="text-xs text-foreground/50">
                                                {formatDistanceToNow(new Date(letter.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex justify-end">
                                    <Link
                                        href={`/motivation-letters/${letter.id}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors border shadow-sm text-foreground/70 bg-background hover:bg-foreground/5 border-border"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Görüntüle
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
    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between gap-4 relative overflow-hidden group">
            {/* Background aesthetic */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-500"></div>

            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                {icon}
            </div>
            <div>
                <div className="text-4xl font-extrabold text-foreground tracking-tight mb-1">{value}</div>
                <div className="text-[11px] font-bold text-foreground/50 uppercase tracking-[0.15em]">{label}</div>
            </div>
        </div>
    );
}
