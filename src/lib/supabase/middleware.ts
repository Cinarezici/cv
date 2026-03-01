import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

    // Auth guard: unauthenticated users redirected to login
    const protectedPaths = ['/dashboard', '/import', '/resumes', '/my-cvs', '/builder', '/scout', '/saved-jobs', '/motivation-letters', '/settings', '/upgrade', '/cv-preview'];
    const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));

    if (!user && isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // NOTE: Canceled-user page access is handled at the page level (each page
    // checks subscription status and shows <LockedPageView /> instead of content).
    // We do NOT redirect here so users can see the locked page for each route.

    return supabaseResponse;
}
