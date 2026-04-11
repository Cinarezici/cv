import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: letter, error } = await supabase
            .from('motivation_letters')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !letter) {
            return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
        }

        return NextResponse.json(letter);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch letter' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const { data: updated, error } = await supabase
            .from('motivation_letters')
            .update({
                content: body.content,
                letter_html: body.letter_html,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update letter' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch first to get storage path
        const { data: letter } = await supabase.from('motivation_letters').select('pdf_storage_path').eq('id', id).eq('user_id', user.id).single();

        if (letter?.pdf_storage_path) {
            await supabase.storage.from('user-files').remove([letter.pdf_storage_path]);
        }

        const { error } = await supabase
            .from('motivation_letters')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete letter' }, { status: 500 });
    }
}
