import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/subscription/expire
 * Called by the client (usePro hook) when it detects a locally-expired trial.
 * Flips status to 'canceled' in DB. Idempotent.
 */
export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ ok: false }, { status: 401 });

        const { data: sub } = await supabase
            .from('subscriptions')
            .select('status, trial_end_at, trial_ends_at')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!sub || sub.status === 'active' || sub.status === 'canceled') {
            return NextResponse.json({ ok: true, status: sub?.status ?? 'unknown' });
        }

        const rawEnd = sub.trial_end_at ?? sub.trial_ends_at;
        if (rawEnd && new Date() > new Date(rawEnd)) {
            await supabase
                .from('subscriptions')
                .update({ status: 'canceled', updated_at: new Date().toISOString() })
                .eq('user_id', user.id);
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
