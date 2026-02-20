import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseServiceRoleKey) {
            return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
        }

        // Verify that the person requesting is authenticated
        const supabase = await createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Admin client to fetch users and subscriptions
        const adminSupabase = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);

        // 1. Fetch all auth users
        const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();
        if (authError) throw authError;

        // 2. Fetch all subscriptions
        const { data: subsData, error: subsError } = await adminSupabase
            .from('subscriptions')
            .select('*');
        if (subsError) throw subsError;

        // Merge data
        const usersList = authData.users.map(u => {
            const sub = subsData.find(s => s.user_id === u.id);
            return {
                id: u.id,
                email: u.email,
                created_at: u.created_at,
                subscription: sub || null,
            };
        });

        // Optional: sort by creation date
        usersList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ users: usersList });
    } catch (error: any) {
        console.error('List users error:', error);
        return NextResponse.json({ error: error.message || 'Failed to list users' }, { status: 500 });
    }
}
