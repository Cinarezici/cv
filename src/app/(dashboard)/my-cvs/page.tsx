import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkUsage } from '@/lib/usage-enforcement';
import MyCVsClient from './MyCVsClient';
import { getEffectiveStatus } from '@/lib/subscription';
import LockedPageView from '@/components/LockedPageView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UnifiedDocument {
    id: string;
    type: 'resume' | 'profile';
    title: string;
    subtitle: string;
    updatedAt: string;
    photoUrl?: string;
    email?: string;
}

export default async function MyCVsPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    if (await getEffectiveStatus(user.id) === 'canceled') {
        return <LockedPageView featureName="My CVs" subtitle="Manage and edit all your CVs with a Pro subscription." />;
    }

    const { allowed } = await checkUsage(user.id, 'cv_generation');
    const isCVLimitReached = !allowed;

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
            updatedAt: p.updated_at,
            photoUrl: p.raw_json?.header?.photo_url,
            email: p.raw_json?.header?.email || ''
        })));
    }

    if (resumes) {
        documents.push(...resumes.map(r => ({
            id: r.id,
            type: 'resume' as const,
            title: r.job_title || 'İsimsiz CV',
            subtitle: r.theme_category ? `Tema: ${r.theme_category}` : 'Standart',
            updatedAt: r.updated_at,
            photoUrl: r.optimized_json?.header?.photo_url,
            email: r.optimized_json?.header?.email || ''
        })));
    }

    documents.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
    });

    return <MyCVsClient documents={documents} isCVLimitReached={isCVLimitReached} />;
}
