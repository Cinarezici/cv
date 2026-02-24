import { createClient } from './supabase/server';

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
