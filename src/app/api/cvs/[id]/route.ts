import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAuth();
        if (auth.error || !auth.user) {
            return NextResponse.json({ error: auth.error || 'unauthorized' }, { status: auth.status || 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const supabase = await createClient();

        // 1. Ownership check
        const { data: cv, error: cvError } = await supabase
            .from('cvs')
            .select('id, user_id, created_at, updated_at')
            .eq('id', id)
            .eq('user_id', auth.user.id)
            .single();

        if (cvError || !cv) {
            return NextResponse.json({ error: 'CV not found or unauthorized' }, { status: 404 });
        }

        // 2. Editing limits for Free users
        const isContentEdit = body.resume_json !== undefined;
        const isSectionOrderEdit = body.section_order !== undefined;

        if (!auth.isPro) {
            if (isSectionOrderEdit) {
                return NextResponse.json(
                    { error: 'upgrade_required', message: 'Section reordering requires Pro plan' },
                    { status: 403 }
                );
            }

            if (isContentEdit) {
                // Free user 30 mins limit check
                const createdAt = new Date(cv.created_at).getTime();
                const now = Date.now();
                const isFirstSession = now - createdAt < 30 * 60 * 1000;

                if (!isFirstSession) {
                    return NextResponse.json(
                        { error: 'upgrade_required', message: 'CV editing requires Pro plan' },
                        { status: 403 }
                    );
                }
            }
        }

        // 3. Update query
        const { error: updateError } = await supabase
            .from('cvs')
            .update({
                ...body,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', auth.user.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('PU CV error:', error);
        return NextResponse.json({ error: 'Failed to update CV' }, { status: 500 });
    }
}
