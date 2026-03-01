import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes accessible to canceled users (locked state)
const CANCELED_ALLOWED = ['/dashboard', '/settings', '/upgrade', '/api/auth', '/auth'];

// Dashboard sub-routes that are fully locked for canceled users
const LOCK_ROUTES = [
    '/import',
    '/my-cvs',
    '/builder',
    '/scout',
    '/saved-jobs',
    '/motivation-letters',
    '/resumes',
    '/cv-preview',
];

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // ── 1. Auth guard: unauthenticated users redirected to login ──────────
    const protectedPaths = ['/dashboard', '/import', '/resumes', '/my-cvs', '/builder', '/scout', '/saved-jobs', '/motivation-letters', '/settings', '/upgrade', '/cv-preview'];
    const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

    if (!user && isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // ── 2. Subscription guard: canceled users locked to allowed routes ─────
    if (user) {
        const isLockedRoute = LOCK_ROUTES.some(r => request.nextUrl.pathname.startsWith(r));
        if (isLockedRoute) {
            // Lazy check: fetch subscription status
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('status, trial_end_at, trial_ends_at')
                .eq('user_id', user.id)
                .maybeSingle();

            let isCanceled = false;
            if (sub?.status === 'canceled') {
                isCanceled = true;
            } else if (sub?.status === 'trialing') {
                const rawEnd = sub.trial_end_at ?? sub.trial_ends_at;
                if (rawEnd && new Date() > new Date(rawEnd)) {
                    isCanceled = true;
                    // Fire-and-forget DB flip (best effort in middleware)
                    supabase
                        .from('subscriptions')
                        .update({ status: 'canceled', updated_at: new Date().toISOString() })
                        .eq('user_id', user.id)
                        .then(() => { });
                }
            }

            if (isCanceled) {
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                url.searchParams.set('locked', '1');
                return NextResponse.redirect(url);
            }
        }
    }

    return supabaseResponse;
}
