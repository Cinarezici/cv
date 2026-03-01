import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveStatus } from '@/lib/subscription';

/**
 * GET /api/motivation-letters/share/[token]
 * Returns letter data for the public share preview page.
 * SERVER-SIDE enforces: if letter owner is 'canceled' → redirect to homepage.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
    try {
        const { token } = await params;
        const supabase = await createClient();

        const { data: letter, error } = await supabase
            .from('motivation_letters')
            .select('*')
            .eq('share_token', token)
            .eq('is_public', true)
            .single();

        if (error || !letter) {
            return NextResponse.json({ error: 'Link geçersiz veya süresi dolmuş' }, { status: 404 });
        }

        if (letter.share_expires_at && new Date(letter.share_expires_at) < new Date()) {
            return NextResponse.json({ error: 'Paylaşım linki süresi doldu' }, { status: 410 });
        }

        // ── Subscription check: if owner is canceled, block access ──
        const ownerStatus = await getEffectiveStatus(letter.user_id);
        if (ownerStatus === 'canceled') {
            return NextResponse.json(
                { redirect: 'https://cvoptimizerai.com', error: 'subscription_canceled' },
                { status: 402 }
            );
        }

        return NextResponse.json({
            company_name: letter.company_name,
            target_role: letter.target_role,
            pdf_url: letter.pdf_url,
            letter_html: letter.letter_html,
            created_at: letter.created_at,
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch letter' }, { status: 500 });
    }
}
