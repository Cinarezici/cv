import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // If email is provided, we need to merge it into raw_json
        if (body.email !== undefined) {
            const { data: doc } = await supabase.from('profiles').select('raw_json').eq('id', id).eq('user_id', user.id).single();
            if (doc) {
                const currentJson = doc.raw_json || {};
                if (!currentJson.header) currentJson.header = {};
                currentJson.header.email = body.email;
                body.raw_json = currentJson;
            }
            delete body.email;
        }

        const { error } = await supabase
            .from('profiles')
            .update(body)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Patch error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
