/**
 * /builder/[id] — CV Builder page (server component)
 *
 * Authenticated owner-only view. Fetches the resume by ID and passes
 * the full row + subscription tier to BuilderClient.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuilderClient from './BuilderClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BuilderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth guard
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    // Fetch resume — owner check via RLS + eq user_id
    const { data: resume } = await supabase
        .from('resumes')
        .select('*, profiles(raw_json)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!resume) redirect('/dashboard');

    // Check subscription status
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const isPro = sub?.status === 'active';

    // Extract avatar from joined profile
    let avatarUrl: string | null = null;
    const profilesArr = resume.profiles as any;
    if (profilesArr) {
        const prof = Array.isArray(profilesArr) ? profilesArr[0] : profilesArr;
        avatarUrl = prof?.raw_json?.avatar_base64 ?? null;
    }

    return <BuilderClient data={resume} avatarUrl={avatarUrl} isPro={isPro} />;
}
