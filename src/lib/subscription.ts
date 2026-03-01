/**
 * src/lib/subscription.ts
 * Single source of truth for subscription status.
 *
 * getEffectiveStatus(userId)
 *   → Returns 'trialing' | 'active' | 'canceled'
 *   → Lazily flips trialing → canceled in DB when trial_end_at has passed.
 *
 * ensureTrialExists(userId)
 *   → Idempotent. Creates a subscriptions row with status='trialing' if none exists.
 *   → Safe to call on every login.
 */

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service';

export type SubscriptionStatus = 'trialing' | 'active' | 'canceled';

export const TRIAL_DAYS = 14;

/**
 * Compute and return the user's effective subscription status.
 * Side-effect: if the trial has expired, flips DB status to 'canceled'.
 */
export async function getEffectiveStatus(userId: string): Promise<SubscriptionStatus> {
    const supabase = await createClient();

    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (!sub) {
        // No record yet — treat as trialing (ensureTrialExists should be called on login)
        return 'trialing';
    }

    // Active pro — always allow
    if (sub.status === 'active') return 'active';

    // Already explicitly canceled
    if (sub.status === 'canceled') return 'canceled';

    // Status is 'trialing' — check if expired
    const now = new Date();

    // Support multiple column name variants in case of schema inconsistency
    const rawEnd = sub.trial_end_at ?? sub.trial_ends_at;
    let trialEndDate: Date | null = null;

    if (rawEnd) {
        trialEndDate = new Date(rawEnd);
    } else if (sub.trial_started_at) {
        trialEndDate = new Date(sub.trial_started_at);
        trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DAYS);
    }

    if (trialEndDate && now > trialEndDate) {
        // Lazily flip to canceled
        await supabase
            .from('subscriptions')
            .update({ status: 'canceled', updated_at: now.toISOString() })
            .eq('user_id', userId);
        return 'canceled';
    }

    return 'trialing';
}

/**
 * Idempotent: ensures the user has a subscriptions row.
 * Creates one with status='trialing' if missing.
 * Call this after every successful login.
 */
export async function ensureTrialExists(userId: string): Promise<void> {
    try {
        // Use service client to bypass RLS for upsert
        const supabase = createServiceRoleClient();
        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

        // Only insert if no row exists (do nothing on conflict)
        const { error } = await supabase
            .from('subscriptions')
            .upsert(
                {
                    user_id: userId,
                    status: 'trialing',
                    trial_start_at: now.toISOString(),
                    trial_end_at: trialEnd.toISOString(),
                    // Also write alternate column names for compatibility
                    trial_started_at: now.toISOString(),
                    trial_ends_at: trialEnd.toISOString(),
                    created_at: now.toISOString(),
                    updated_at: now.toISOString(),
                },
                {
                    onConflict: 'user_id',
                    ignoreDuplicates: true, // DO NOT overwrite if row exists
                }
            );

        if (error) {
            console.error('[ensureTrialExists] upsert error:', error.message);
        }
    } catch (err) {
        console.error('[ensureTrialExists] unexpected error:', err);
    }
}

/**
 * Check if a status is "locked" (i.e., cannot use the product).
 */
export function isCanceled(status: SubscriptionStatus): boolean {
    return status === 'canceled';
}
