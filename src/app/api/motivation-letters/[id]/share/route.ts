import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { is_public } = await request.json();

        // 1. Get current token/status
        const { data: letter } = await supabase.from('motivation_letters').select('share_token, is_public').eq('id', id).eq('user_id', user.id).single();
        if (!letter) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // 2. Generate or toggle
        let shareToken = letter.share_token;
        if (!shareToken) {
            shareToken = crypto.randomUUID();
        }

        const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
        const isPro = sub?.status === 'active';
        const shareExpiry = !isPro ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const shareUrl = `${appUrl}/m/${shareToken}`;

        const { data: updated, error } = await supabase
            .from('motivation_letters')
            .update({
                is_public,
                share_token: shareToken,
                share_url: shareUrl,
                share_expires_at: shareExpiry,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            is_public: updated.is_public,
            share_url: updated.share_url
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 });
    }
}
