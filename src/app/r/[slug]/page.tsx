import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import ResumeViewer from './ResumeViewer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: resume } = await supabase
        .from('resumes')
        .select(`*, profiles(raw_json)`)
        .eq('public_link_slug', slug)
        .eq('is_active', true)
        .single();

    if (!resume) notFound();

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', resume.user_id)
        .single();

    const { data: profileDate } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', resume.user_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    const accountCreationDate = profileDate ? new Date(profileDate.created_at) : new Date(resume.created_at);
    const trialEndDate = new Date(accountCreationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const hasActiveSub = subscription?.status === 'active';
    const trialTimeRemaining = now < trialEndDate;

    if (!hasActiveSub && !trialTimeRemaining) {
        redirect('/');
    }

    const data = JSON.parse(JSON.stringify(resume.optimized_json)); // deep copy

    // Type casting because Supabase joins return array or object depending on schema relations
    let profilesArr = resume.profiles as any;
    let avatarUrl = null;

    // Safely extract avatar
    if (profilesArr) {
        if (Array.isArray(profilesArr) && profilesArr.length > 0) {
            avatarUrl = profilesArr[0]?.raw_json?.avatar_base64;
        } else if (profilesArr.raw_json) {
            avatarUrl = profilesArr.raw_json.avatar_base64;
        }
    }

    // Modern Premium Layout (Print-ready, controlled by Client Component)
    return <ResumeViewer data={data} initialAvatarUrl={avatarUrl} />;
}
