import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';

const HOME_URL = 'https://cvoptimizerai.com';
const PRICING_URL = 'https://cvoptimizerai.com/pricing';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug) {
        return NextResponse.redirect(HOME_URL);
    }

    const supabase = createServiceRoleClient();

    try {
        // 1. Find the short link
        const { data: link, error: linkErr } = await supabase
            .from('letter_share_links')
            .select('letter_id, expires_at, owner_user_id')
            .eq('slug', slug)
            .maybeSingle();

        if (linkErr || !link) {
            console.warn(`[ShortLink] Slug not found: ${slug}`);
            return NextResponse.redirect(HOME_URL);
        }

        // 2. Fetch Owner Subscription & Profile
        const [{ data: sub }, { data: profile }] = await Promise.all([
            supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', link.owner_user_id)
                .maybeSingle(),
            supabase
                .from('profiles')
                .select('created_at')
                .eq('user_id', link.owner_user_id)
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle()
        ]);

        const now = new Date();

        // Check if owner is active pro or active trialing/free trial
        const isProActive = ['active'].includes(sub?.status as string);

        let isTrialActive = false;
        if (sub?.trial_ends_at) {
            isTrialActive = now < new Date(sub.trial_ends_at);
        } else if (sub?.trial_started_at) {
            const end = new Date(sub.trial_started_at);
            end.setDate(end.getDate() + 14);
            isTrialActive = now < end;
        } else if (profile?.created_at) {
            const end = new Date(profile.created_at);
            end.setDate(end.getDate() + 14);
            isTrialActive = now < end;
        }

        // 3. User Requested: If creator is NOT active and NOT trialing (meaning cancelled/expired free trial)
        // Redirect to homepage automatically!
        if (!isProActive && !isTrialActive) {
            console.warn(`[ShortLink] Creator subscription is inactive/canceled for slug: ${slug}`);
            return NextResponse.redirect(HOME_URL);
        }

        // 4. Check explicit token/link expiration (fallback for older or standard trial limits)
        if (link.expires_at) {
            const expires = new Date(link.expires_at);
            if (now > expires) {
                console.warn(`[ShortLink] Slug expired: ${slug}`);
                return NextResponse.redirect(PRICING_URL);
            }
        }

        // 3. Update last accessed (optional but good for metrics)
        // Fire & forget
        supabase
            .from('letter_share_links')
            .update({ last_accessed_at: new Date().toISOString() })
            .eq('slug', slug)
            .then();

        // 4. Fetch the token from motivation_letters so we can redirect to the existing viewer
        const { data: letter, error: letterErr } = await supabase
            .from('motivation_letters')
            .select('share_token')
            .eq('id', link.letter_id)
            .maybeSingle();

        if (letterErr || !letter?.share_token) {
            console.warn(`[ShortLink] Letter or token not found for slug: ${slug}`);
            return NextResponse.redirect(HOME_URL);
        }

        // 5. Redirect to the actual viewer
        // Use absolute URL to prevent relative path issues
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvoptimizerai.com';
        const targetUrl = new URL(`/ml/share/${letter.share_token}`, baseUrl);

        return NextResponse.redirect(targetUrl.toString());

    } catch (err) {
        console.error(`[ShortLink] Unexpected error resolving slug ${slug}:`, err);
        return NextResponse.redirect(HOME_URL);
    }
}
