import { createClient } from './supabase/server';
import { getEffectiveStatus } from './subscription';

export async function requireAuth() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { error: 'unauthorized', status: 401, user: null, isPro: false };
    }

    // Custom logic: check if user is pro based on is_pro_user function
    const { data: isPro } = await supabase.rpc('is_pro_user', {
        check_user_id: session.user.id
    });

    return { user: session.user, isPro: isPro === true, error: null };
}

export async function requirePro() {
    const auth = await requireAuth();
    if (auth.error) return auth;

    if (!auth.isPro) {
        return { error: 'upgrade_required', status: 403, user: auth.user, isPro: false };
    }

    return auth;
}

/**
 * Returns 402 if the user's subscription is canceled (trial expired, not upgraded).
 * Use this guard at the top of any API route that should be blocked for canceled users.
 */
export async function requireNotCanceled() {
    const auth = await requireAuth();
    if (auth.error) return auth;

    const effectiveStatus = await getEffectiveStatus(auth.user!.id);

    if (effectiveStatus === 'canceled') {
        return {
            error: 'trial_expired',
            status: 402,
            user: auth.user,
            isPro: false,
            message: 'Your trial has ended. Please upgrade to Pro to continue.',
        };
    }

    return { ...auth, subscriptionStatus: effectiveStatus };
}
