/**
 * cv-share.ts — Server-side resolver for the protected CV share link system.
 *
 * Runs exclusively on the server with the service-role key.
 * Subscription data is never returned to the client.
 *
 * SUBSCRIPTION RULES:
 *   trialActive  = now < trial_ends_at
 *                  OR (trial_ends_at null AND now < trial_started_at + 14d)
 *                  OR (no sub row AND now < profiles.created_at + 14d)
 *   proActive    = status='active'
 *   Access = trialActive OR proActive
 */

import { createServiceRoleClient } from './supabase/service';

export const SHARE_LINK_TRIAL_DAYS = 14;

/* ---------- Public return types ---------- */

export interface ShareResolvedOk {
    allowed: true;
    resume: any; // full resumes row
    isPro: boolean;
}

export interface ShareResolvedDenied {
    allowed: false;
    reason: 'not_found' | 'disabled' | 'expired';
}

export type ShareResolved = ShareResolvedOk | ShareResolvedDenied;

/* ---------- Core resolver ---------- */

export async function resolveShareAccess(shareId: string): Promise<ShareResolved> {
    const supabase = createServiceRoleClient();
    const now = new Date(); // Server-side timestamp — never trust client

    try {
        // ── 1. Fetch the share link ──────────────────────────────────────────────
        const { data: link, error: linkErr } = await supabase
            .from('cv_share_links')
            .select('id, resume_id, owner_user_id, is_enabled, created_at')
            .eq('id', shareId)
            .maybeSingle(); // Use maybeSingle to avoid error when not found

        if (linkErr || !link) {
            console.log('[resolveShareAccess] link not found or query err for shareId:', shareId);
            return { allowed: false, reason: 'not_found' };
        }

        if (!link.is_enabled) {
            console.log('[resolveShareAccess] link is disabled:', shareId);
            return { allowed: false, reason: 'disabled' };
        }

        const { owner_user_id, resume_id, created_at } = link;

        // ── 2. Fetch subscription row ────────────────────────────────────────────
        const { data: sub, error: subErr } = await supabase
            .from('subscriptions')
            .select('*')   // use * — avoids errors from column names that may not exist
            .eq('user_id', owner_user_id)
            .maybeSingle();

        if (subErr) {
            console.error('[resolveShareAccess] subscriptions query error:', subErr.message ?? subErr.code ?? subErr);
        }

        // ── 3. Compute access ────────────────────────────────────────────────────
        const isPro = sub?.is_pro === true || sub?.status === 'active' || sub?.plan === 'lifetime';

        console.log('[resolveShareAccess] auth check:', {
            shareId, ownerUserId: owner_user_id, isPro,
            subStatus: sub?.status, subIsPro: sub?.is_pro, subPlan: sub?.plan
        });

        // If not Pro, enforce 14-day limit
        if (!isPro) {
            const linkCreatedAt = new Date(created_at);
            const expiryDate = new Date(linkCreatedAt);
            expiryDate.setDate(expiryDate.getDate() + SHARE_LINK_TRIAL_DAYS);

            if (now > expiryDate) {
                console.log(`[resolveShareAccess] link expired. Created: ${linkCreatedAt}, Expiry: ${expiryDate}, Now: ${now}`);
                return { allowed: false, reason: 'expired' };
            }
        }

        // ── 4. Fetch full resume row ─────────────────────────────────────────────
        const { data: resume, error: resumeErr } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', resume_id)
            .maybeSingle();

        if (resumeErr || !resume) {
            console.error('[resolveShareAccess] resumes query error or not found:', resumeErr);
            return { allowed: false, reason: 'not_found' };
        }

        return { allowed: true, resume, isPro };

    } catch (err) {
        console.error('[resolveShareAccess] unexpected error:', err);
        return { allowed: false, reason: 'not_found' };
    }
}

/**
 * resolveLetterAccess — Validates access to a shared Motivation Letter link.
 * Checks owner subscription/trial and link status.
 */
export async function resolveLetterAccess(token: string): Promise<ShareResolved> {
    try {
        const supabase = createServiceRoleClient();

        // 1. Fetch Letter — access is controlled by share_token + expiry, not is_public flag
        const { data: letter, error: lError } = await supabase
            .from('motivation_letters')
            .select('*')
            .eq('share_token', token)
            .single();

        if (lError || !letter) {
            console.log('[resolveLetterAccess] not found or private:', token);
            return { allowed: false, reason: 'not_found' };
        }

        const owner_user_id = letter.user_id;

        // 2. Fetch Owner Subscription & Profile
        const now = new Date();
        const [{ data: sub }, { data: profile }] = await Promise.all([
            supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', owner_user_id)
                .maybeSingle(),
            supabase
                .from('profiles')
                .select('created_at')
                .eq('user_id', owner_user_id)
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle()
        ]);

        const trialActive = computeTrialActive(sub, profile?.created_at, now);
        const proActive = computeProActive(sub, now);

        console.log('[resolveLetterAccess] auth check:', {
            token, owner_user_id, trialActive, proActive,
            subStatus: sub?.status, profileCreatedAt: profile?.created_at,
        });

        if (!trialActive && !proActive) {
            return {
                allowed: false,
                reason: 'expired',
            };
        }

        // Link expiry check
        if (letter.share_expires_at && new Date(letter.share_expires_at) < now) {
            return { allowed: false, reason: 'not_found' }; // Map expiry to not_found to keep it simple or use a new reason
        }

        return { allowed: true, resume: letter, isPro: proActive }; // 'resume' here is 'letter' object

    } catch (err) {
        console.error('[resolveLetterAccess] unexpected error:', err);
        return { allowed: false, reason: 'not_found' };
    }
}

/* ---------- Helpers ---------- */

function computeTrialActive(
    sub: { trial_started_at?: string | null; trial_ends_at?: string | null } | null | undefined,
    profileCreatedAt: string | null | undefined,
    now: Date,
): boolean {
    // Explicit trial_ends_at
    if (sub?.trial_ends_at) {
        return now < new Date(sub.trial_ends_at);
    }
    // 14 days from trial_started_at
    if (sub?.trial_started_at) {
        const end = new Date(sub.trial_started_at);
        end.setDate(end.getDate() + 14);
        return now < end;
    }
    // 14 days from account / profile creation date
    if (profileCreatedAt) {
        const end = new Date(profileCreatedAt);
        end.setDate(end.getDate() + 14);
        return now < end;
    }
    return false;
}

function computeProActive(
    sub: { status?: string | null } | null | undefined,
    now: Date,
): boolean {
    return sub?.status === 'active';
}

/* ---------- Create a share link for a resume ---------- */

export async function createShareLink(
    resumeId: string,
    ownerUserId: string,
): Promise<{ shareId: string; shareUrl: string }> {
    const supabase = createServiceRoleClient();

    // Check if an enabled link already exists
    const { data: existing } = await supabase
        .from('cv_share_links')
        .select('id, is_enabled')
        .eq('resume_id', resumeId)
        .eq('owner_user_id', ownerUserId)
        .maybeSingle();

    let shareId: string;

    if (existing) {
        if (!existing.is_enabled) {
            await supabase
                .from('cv_share_links')
                .update({ is_enabled: true })
                .eq('id', existing.id);
        }
        shareId = existing.id;
    } else {
        const { data: newLink, error } = await supabase
            .from('cv_share_links')
            .insert({ resume_id: resumeId, owner_user_id: ownerUserId, is_enabled: true })
            .select('id')
            .single();

        if (error || !newLink) throw new Error(error?.message ?? 'Failed to create share link');
        shareId = newLink.id;
    }

    // Use NEXT_PUBLIC_APP_URL in production; derive from request in dev
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return { shareId, shareUrl: `${baseUrl}/cv/${shareId}` };
}

/* ---------- Disable a share link ---------- */

export async function disableShareLink(shareId: string, ownerUserId: string): Promise<void> {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
        .from('cv_share_links')
        .update({ is_enabled: false })
        .eq('id', shareId)
        .eq('owner_user_id', ownerUserId);
    if (error) throw new Error(error.message);
}
