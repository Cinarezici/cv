import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseServiceRoleKey) {
            return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
        }

        // 1. Check logged-in user
        const supabase = await createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Admin client to update DB
        const adminSupabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);

        const { targetUserId, newStatus } = await request.json();

        if (!targetUserId || !newStatus) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        let trial_end = null;
        if (newStatus === 'active') {
            // Give 365 days of pro from now
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 365);
            trial_end = endDate.toISOString();
        } else if (newStatus === 'canceled' || newStatus === 'expired') {
            // Kill sub completely
            trial_end = new Date().toISOString();
        } else {
            // Keep existing trial_end if transitioning to trialing... (not normally done from admin manually)
        }

        const updatePayload: any = { status: newStatus };
        if (trial_end) {
            updatePayload.trial_end = trial_end;
        }

        // Try to update exists
        const { data: sub } = await adminSupabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', targetUserId)
            .single();

        if (sub) {
            const { error: updateError } = await adminSupabase
                .from('subscriptions')
                .update(updatePayload)
                .eq('user_id', targetUserId);

            if (updateError) throw updateError;
        } else {
            // Edge case: If somehow user missed trigger, create a sub for them here!
            const { error: insertError } = await adminSupabase
                .from('subscriptions')
                .insert({
                    user_id: targetUserId,
                    ...updatePayload
                });
            if (insertError) throw insertError;
        }

        return NextResponse.json({ success: true, message: 'Updated subscription successfully' });
    } catch (error: any) {
        console.error('Update sub error:', error);
        return NextResponse.json({ error: error.message || 'Failed to apply subscription' }, { status: 500 });
    }
}
