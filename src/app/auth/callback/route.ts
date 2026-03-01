import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureTrialExists } from '@/lib/subscription';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.user) {
            // ── Phase 2: Ensure trial subscription exists on first login ──
            await ensureTrialExists(data.user.id);
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=OAuthCallbackError`);
}
