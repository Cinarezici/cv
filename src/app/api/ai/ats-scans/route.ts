import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: scans, error } = await supabase
            .from('ats_scans')
            .select('id, file_name, overall_score, result, cv_text, improved_cv, structured_cv, job_description, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching ATS scans:', error);
            return NextResponse.json({ scans: [] });
        }

        return NextResponse.json({ scans: scans || [] });
    } catch (error: any) {
        console.error('ATS Scans list error:', error);
        return NextResponse.json({ scans: [] });
    }
}
