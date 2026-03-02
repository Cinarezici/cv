import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
    try {
        // Authenticate user
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use service role for deleting user data (bypasses RLS)
        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
        );

        // Delete user's data in order (respecting FKs)
        await Promise.allSettled([
            adminSupabase.from('motivation_letters').delete().eq('user_id', user.id),
            adminSupabase.from('resumes').delete().eq('user_id', user.id),
            adminSupabase.from('profiles').delete().eq('user_id', user.id),
            adminSupabase.from('subscriptions').delete().eq('user_id', user.id),
            adminSupabase.from('saved_jobs').delete().eq('user_id', user.id),
            adminSupabase.from('scout_logs').delete().eq('user_id', user.id),
        ]);

        // Delete the auth user itself
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
            console.error('[Delete Account] Failed to delete auth user:', deleteError);
            return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Delete Account] Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
