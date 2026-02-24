import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
