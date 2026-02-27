import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapToResumeJSON } from '@/lib/resume-mapper';

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Find a user who has a profile or resume
        let cvId = null;
        let userId = null;
        let isResume = false;

        const { data: resumes } = await supabase.from('resumes').select('id, user_id').limit(1);
        if (resumes && resumes.length > 0) {
            cvId = resumes[0].id;
            userId = resumes[0].user_id;
            isResume = true;
        } else {
            const { data: profiles } = await supabase.from('profiles').select('id, user_id').limit(1);
            if (profiles && profiles.length > 0) {
                cvId = profiles[0].id;
                userId = profiles[0].user_id;
            }
        }

        if (!cvId) return NextResponse.json({ error: 'No resumes or profiles found in the whole database' }, { status: 400 });

        // 1. Fetch CV Data
        let resumeJSON: any = null;
        if (isResume) {
            const { data: cv } = await supabase.from('resumes').select('*').eq('id', cvId).eq('user_id', userId).single();
            if (cv) resumeJSON = cv.optimized_json;
        } else {
            const { data: p } = await supabase.from('profiles').select('*').eq('id', cvId).eq('user_id', userId).single();
            if (p) resumeJSON = mapToResumeJSON(p.raw_json);
        }

        if (!resumeJSON) {
            return NextResponse.json({ error: 'CV bulunamadı' }, { status: 404 });
        }

        // Test inserting the letter
        const { data: letter, error: insertError } = await supabase.from('motivation_letters').insert({
            user_id: userId,
            cv_id: cvId,
            company_name: 'Test Test Test', // Make it obvious if it stays
            job_title: 'Software Engineer',
            tone: 'startup',
            content: '',
            letter_html: '',
            generation_status: 'pending',
            batch_id: 'test'
        }).select().single();

        if (insertError) {
            return NextResponse.json({ error: 'DB insert failed: ' + insertError.message }, { status: 500 });
        }

        await supabase.from('motivation_letters').delete().eq('id', letter.id);

        return NextResponse.json({ success: true, cvId, isResume });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
