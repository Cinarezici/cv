import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── PATCH — Save CV changes ────────────────────────────────────────────────
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

        // Only update columns that actually exist in the resumes table
        const allowed = [
            'optimized_json',     // CV content
            'job_title',          // optional label
            'is_active',          // visibility toggle
            // Design / theme (added in setup_phase16.sql)
            'theme_id',
            'theme_category',
            'color_palette_id',
            'section_order',
            'hidden_sections',
        ];
        const patch: Record<string, unknown> = {};
        for (const key of allowed) {
            if (key in body) patch[key] = body[key];
        }

        const { error } = await supabase
            .from('resumes')
            .update(patch)
            .eq('id', id)
            .eq('user_id', user.id); // ownership check

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Save resume error:', error);
        return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
    }
}

// ── DELETE — Remove CV ─────────────────────────────────────────────────────
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
            .from('resumes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
    }
}
