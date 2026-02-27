import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SavedJobsClient from '@/components/jobs/SavedJobsClient';

export default async function SavedJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: savedJobs } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const initialJobs = savedJobs?.map(j => j.job_data) || [];

    const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
    const isPro = ['active', 'trialing'].includes(sub?.status as string);

    return <SavedJobsClient initialJobs={initialJobs} isPro={isPro} userId={user.id} />;
}
