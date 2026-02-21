import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OPTIMIZE_PROMPT = `You are a world-class executive resume writer and career coach. Your task is to rewrite the experience bullet points and professional summary to perfectly tailor the candidate to the provided Job Description.

STRICT RULES:
1. NEVER invent new jobs, dates, or skills that are entirely fabricated.
2. ONLY rephrase existing bullet points to emphasize relevant keywords from the JD.
3. Write with high-impact action verbs (e.g., Spearheaded, Orchestrated, Engineered).
4. Quantify achievements where context allows.
5. Keep each bullet concise and punchy.
6. The output MUST be a perfectly formatted, raw JSON object representing the entire resume.
7. Return ONLY JSON. Do not include markdown formatting or conversational text like "Here is the JSON...".

The JSON MUST follow the exact structure of the input ORIGIN RESUME JSON.`;

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
                    content: `JOB DESCRIPTION:\n${jobDescription}\n\nORIGINAL RESUME JSON:\n${JSON.stringify(profile.raw_json)}\n\nReturn the complete, rewritten resume JSON.`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
        });

        const rawContent = completion.choices[0].message?.content || '{}';
        const optimizedData = JSON.parse(rawContent);
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
