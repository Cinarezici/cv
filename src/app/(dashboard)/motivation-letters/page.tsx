import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LetterDashboardClient from '@/components/motivation-letters/LetterDashboardClient';
import { getEffectiveStatus } from '@/lib/subscription';
import LockedPageView from '@/components/LockedPageView';

export default async function MotivationLettersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    if (await getEffectiveStatus(user.id) === 'canceled') {
        return <LockedPageView featureName="My Letters" subtitle="Create and manage AI-generated cover letters with a Pro subscription." />;
    }

    // Fetch letters on server side initially
    const { data: letters } = await supabase
        .from('motivation_letters')
        .select(`*`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Check Plan Status
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const isPro = ['active'].includes(sub?.status as string);

    return <LetterDashboardClient initialLetters={letters || []} isPro={isPro} userId={user.id} />;
}
