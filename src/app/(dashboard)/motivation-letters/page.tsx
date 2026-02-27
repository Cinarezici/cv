import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LetterDashboardClient from '@/components/motivation-letters/LetterDashboardClient';

export default async function MotivationLettersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
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

    const isPro = ['active', 'trialing'].includes(sub?.status as string);

    return <LetterDashboardClient initialLetters={letters || []} isPro={isPro} userId={user.id} />;
}
