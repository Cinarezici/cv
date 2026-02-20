import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OPTIMIZE_PROMPT = `You are an expert resume writer. Your task is to rewrite the experience bullet points to better match the job description.

STRICT RULES:
1. NEVER invent new experiences or skills not in the original
2. ONLY rephrase existing bullet points to emphasize relevant keywords
3. Use strong action verbs
4. Include keywords from the JD naturally
5. Keep each bullet under 120 characters
6. Return ONLY valid JSON with the same structure as input`;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { profileId, jobDescription } = await request.json();

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .eq('user_id', user.id)
            .single();

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: OPTIMIZE_PROMPT },
                {
                    role: 'user',
                    content: `JOB DESCRIPTION:\n${jobDescription}\n\nORIGINAL RESUME JSON:\n${JSON.stringify(profile.raw_json)}\n\nReturn the complete resume JSON with only the bullet points rewritten to match the JD.`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
        });

        const optimizedData = JSON.parse(completion.choices[0].message?.content || '{}');
        const slug = generateSlug();

        // Extract job title from JD (first line or AI extracted)
        const jobTitle = jobDescription.split('\n')[0].slice(0, 100);

        // Core Resumes Table Update
        const { data: resume, error } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                profile_id: profileId,
                optimized_json: optimizedData,
                public_link_slug: slug,
                job_title: jobTitle,
                is_active: true,
            })
            .select()
            .single();

        if (error) throw error;

        // ---------- NEW ADVANCED ARCHITECTURE FLOW ---------- //
        // 1. Insert into job_posts
        const { data: jobPost } = await supabase.from('job_posts').insert({
            user_id: user.id,
            title: jobTitle,
            company_name: "TBD",
            description: jobDescription
        }).select().single();

        // 2. Insert into resume_versions
        let resumeVersionId = null;
        if (jobPost && resume) {
            const { data: resumeVersion } = await supabase.from('resume_versions').insert({
                user_id: user.id,
                resume_id: resume.id,
                job_post_id: jobPost.id,
                content: optimizedData,
                version_number: 1
            }).select().single();
            resumeVersionId = resumeVersion?.id;
        }

        // 3. Insert into shared_links
        if (resumeVersionId) {
            await supabase.from('shared_links').insert({
                user_id: user.id,
                resume_version_id: resumeVersionId,
                slug: slug,
                is_active: true
            });
        }
        // ---------------------------------------------------- //

        return NextResponse.json({ resume });
    } catch (error) {
        console.error('Optimize error:', error);
        return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
    }
}
