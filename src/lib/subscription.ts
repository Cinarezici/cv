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

/**
 * Ensures the user has a profile and a unique referral_code.
 * Also handles initial referrer linking if metadata exists.
 */
export async function ensureProfileExists(userId: string): Promise<void> {
    const supabase = createServiceRoleClient();
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    const referralCode = userId.split('-')[0]; // Simple, unique-ish code from UUID

    // 1. Create or Update Profile with referral_code
    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            referral_code: referralCode,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id', ignoreDuplicates: true });

    // 2. Handle Referrer Linking if metadata exists and not already linked
    const referrerCode = user.user?.user_metadata?.referrer_code;
    if (referrerCode) {
        // Find the referrer by their code
        const { data: referrer } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', referrerCode)
            .single();

        if (referrer && referrer.id !== userId) {
            await supabase
                .from('profiles')
                .update({ referrer_id: referrer.id })
                .eq('id', userId)
                .is('referrer_id', null); // Only link if not already linked
        }
    }
}

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

/**
 * Logic for awarding a referral reward (e.g., +30 days to referrer).
 * Threshold: 2 successful upgrades.
 */
export async function processReferralReward(referredUserId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    // 1. Find if this user was referred
    const { data: profile } = await supabase
        .from('profiles')
        .select('referrer_id')
        .eq('id', referredUserId)
        .single();

    if (!profile?.referrer_id) return;

    const referrerId = profile.referrer_id;

    // 2. Upsert referral status for this pair
    await supabase
        .from('referrals')
        .upsert({
            referrer_id: referrerId,
            referred_id: referredUserId,
            status: 'upgraded',
            updated_at: new Date().toISOString()
        }, { onConflict: 'referred_id' });

    // 3. Count total 'upgraded' referrals for this referrer
    const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', referrerId)
        .eq('status', 'upgraded');

    // 4. Threshold Logic: Every 2 referrals = 1 month free
    if (count && count > 0 && count % 2 === 0) {
        await awardFreeMonth(referrerId);
    }
}

/**
 * Extends a user's subscription by 30 days.
 */
async function awardFreeMonth(userId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    // Fetch current subscription
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!sub) return;

    // Extend current_period_end by 30 days
    const currentEnd = sub.current_period_end ? new Date(sub.current_period_end) : new Date();
    // If expired, start from now
    const baseDate = currentEnd > new Date() ? currentEnd : new Date();
    const newEnd = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    await supabase
        .from('subscriptions')
        .update({
            current_period_end: newEnd.toISOString(),
            status: 'active', // Ensure it's active
            is_pro: true,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

    console.log(`[ReferralReward] Awarded 30 days to user ${userId}. New expiry: ${newEnd.toISOString()}`);
}
