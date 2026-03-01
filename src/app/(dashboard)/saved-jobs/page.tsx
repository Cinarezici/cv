import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SavedJobsClient from '@/components/jobs/SavedJobsClient';
import { getEffectiveStatus } from '@/lib/subscription';
import LockedPageView from '@/components/LockedPageView';

export default async function SavedJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    if (await getEffectiveStatus(user.id) === 'canceled') {
        return <LockedPageView featureName="Saved Jobs" subtitle="Save and revisit your favorite job listings with a Pro subscription." />;
    }

    const { data: savedJobs } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const initialJobs = savedJobs?.map(j => j.job_data) || [];

    const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
    const isPro = ['active'].includes(sub?.status as string);

    return <SavedJobsClient initialJobs={initialJobs} isPro={isPro} userId={user.id} />;
}
