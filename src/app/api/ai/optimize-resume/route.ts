import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai-client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 1 minute on Vercel
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';
import { checkUsage, incrementUsage } from '@/lib/usage-enforcement';
import { getLimitsForPlan } from '@/config/plans';


const OPTIMIZE_PROMPT = `You are a world-class executive resume writer and career coach. Rewrite the candidate's experience bullet points and professional summary to perfectly match the provided Job Description.

## STRICT RULES
1. NEVER invent jobs, dates, companies, or skills entirely fabricated — only rephrase existing ones.
2. DO rephrase bullet points to emphasize relevant keywords from the JD.
3. Use high-impact action verbs: Spearheaded, Orchestrated, Engineered, Drove, Scaled, etc.
4. Quantify achievements where context reasonably allows (add metrics if inferable, not invented).
5. Keep each bullet concise: 1 strong sentence per bullet.
6. Return ONLY a valid raw JSON object. No markdown, no code fences, no explanation text.

## CRITICAL JSON STRUCTURE RULES
- The "experience" array items MUST have a "bullets" field that is an ARRAY OF STRINGS (e.g., ["Led team...", "Delivered..."]).
- Do NOT join bullets into a single string.
- Do NOT use HTML in bullet strings.
- The output JSON MUST follow the exact same field structure as the input ORIGIN RESUME JSON.
- If a field is not in the input, do not add it.

Return ONLY the complete JSON object representing the full rewritten resume.`;


export async function POST(request: NextRequest) {
    try {
        const openai = getOpenAI();
        const supabase = await createClient();
        // 1. Subscription & Usage check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const usageCheck = await checkUsage(user.id, 'ai_optimization');
        
        if (!usageCheck.allowed) {
            return NextResponse.json({
                error: usageCheck.reason === 'limit_exceeded' 
                    ? 'AI Optimization limit reached for your current plan. Please upgrade to unlock more optimizations.'
                    : 'A subscription is required to use this feature.',
                code: 'LIMIT_REACHED'
            }, { status: 403 });
        }

        const planLimits = getLimitsForPlan(usageCheck.plan || 'free');
        const modelToUse = planLimits.advanced_ai ? 'gpt-4o' : 'gpt-4o-mini';

        const { documentId, documentType, jobDescription, profileId: legacyProfileId } = await request.json();

        // Support legacy calls
        const actualDocId = documentId || legacyProfileId;
        const actualDocType = documentType || 'profile';

        let sourceJson = {};
        let originProfileId = null;

        if (actualDocType === 'profile') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', actualDocId)
                .eq('user_id', user.id)
                .single();

            if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
            sourceJson = profile.raw_json;
            originProfileId = profile.id;
        } else {
            const { data: existingResume } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', actualDocId)
                .eq('user_id', user.id)
                .single();

            if (!existingResume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
            sourceJson = existingResume.optimized_json;
            originProfileId = existingResume.profile_id;
        }

        const completion = await openai.chat.completions.create({
            model: modelToUse,
            messages: [
                { role: 'system', content: OPTIMIZE_PROMPT },
                {
                    role: 'user',
                    content: `JOB DESCRIPTION:\n${jobDescription}\n\nORIGINAL RESUME JSON:\n${JSON.stringify(sourceJson)}\n\nReturn the complete, rewritten resume JSON.`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
        });

        const rawContent = completion.choices[0].message?.content || '{}';

        let optimizedData;
        try {
            optimizedData = JSON.parse(rawContent);
        } catch (parseError) {
            console.error('Failed to parse AI output:', rawContent);
            return NextResponse.json({ error: 'AI returned an invalid response. Please try again.' }, { status: 500 });
        }

        const slug = generateSlug();

        // Extract job title from JD (first line or AI extracted)
        const jobTitle = jobDescription.split('\n')[0].slice(0, 100);

        // Core Resumes Table Update
        const insertPayload: any = {
            user_id: user.id,
            optimized_json: optimizedData,
            public_link_slug: slug,
            job_title: jobTitle,
            is_active: true,
        };

        if (originProfileId) {
            insertPayload.profile_id = originProfileId;
        }

        const { data: resume, error } = await supabase
            .from('resumes')
            .insert(insertPayload)
            .select()
            .single();

        if (error) {
            console.error('Core insertion failed:', error.message);
            throw error;
        }

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

        // Increment usage atomically
        if (usageCheck.periodStart) {
            await incrementUsage(user.id, 'ai_optimization', usageCheck.periodStart);
        }

        return NextResponse.json({ 
            success: true, 
            resume: optimizedData,
            resumeId: resume.id
        });
    } catch (error) {
        console.error('Optimize error:', error);
        return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
    }
}
