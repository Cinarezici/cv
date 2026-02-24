import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { jobData, action } = body;

        if (!jobData || !jobData.id) {
            return NextResponse.json({ error: 'Invalid job data' }, { status: 400 });
        }

        if (action === 'save') {
            const { error } = await supabase
                .from('saved_jobs')
                .upsert({
                    user_id: user.id,
                    source_id: jobData.id,
                    job_data: jobData
                }, { onConflict: 'user_id, source_id' });

            if (error) throw error;
            return NextResponse.json({ success: true, saved: true });
        }

        if (action === 'unsave') {
            const { error } = await supabase
                .from('saved_jobs')
                .delete()
                .eq('user_id', user.id)
                .eq('source_id', jobData.id);

            if (error) throw error;
            return NextResponse.json({ success: true, saved: false });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Save job error:', error);
        return NextResponse.json({ error: 'Failed to manage saved job' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: savedJobs, error } = await supabase
            .from('saved_jobs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ jobs: savedJobs.map((j: any) => j.job_data) });

    } catch (error: any) {
        console.error('Get saved jobs error:', error);
        return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
    }
}
