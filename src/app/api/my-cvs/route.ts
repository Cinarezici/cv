import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch both profiles and resumes concurrently
        const [{ data: resumes }, { data: profiles }] = await Promise.all([
            supabase.from('resumes').select('id, job_title').eq('user_id', user.id),
            supabase.from('profiles').select('id, full_name, headline').eq('user_id', user.id)
        ]);

        const allCvs: { id: string; title: string; type: 'profile' | 'resume' }[] = [];

        if (profiles && profiles.length > 0) {
            allCvs.push(...profiles.map(p => ({
                id: p.id,
                title: p.full_name ? `${p.full_name} — My CV` : "My CV",
                type: 'profile' as const
            })));
        }

        if (resumes && resumes.length > 0) {
            allCvs.push(...resumes.map(r => ({
                id: r.id,
                title: r.job_title || 'Untitled CV',
                type: 'resume' as const
            })));
        }

        return NextResponse.json({ cvs: allCvs });
    } catch (error: any) {
        console.error('Error fetching CVs:', error);
        return NextResponse.json({ error: 'Failed to fetch CVs' }, { status: 500 });
    }
}
