import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';
import { mapToResumeJSON } from '@/lib/resume-mapper';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LETTER_PROMPT = `You are an expert career consultant and persuasive writer. Your goal is to write a highly professional, compelling, and tailored cover letter (motivation letter) for a candidate.

STRICT RULES:
1. Tone should be professional yet enthusiastic.
2. Emphasize how the candidate's specific skills and experience (from the provided JSON) solve the problems outlined in the job description.
3. Structure: Introduction, 2-3 body paragraphs, and a strong closing with a call to action.
4. Keep the length under 350 words.
5. Do not invent facts that aren't in the candidate's profile.
6. The output should be raw markdown text for the letter content.`;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { job, profileId } = await request.json();

        // 1. Fetch user's latest CV data
        let cvQuery = supabase
            .from('cvs')
            .select('*')
            .eq('user_id', user.id);

        if (profileId && profileId !== 'default') {
            cvQuery = cvQuery.eq('id', profileId);
        } else {
            cvQuery = cvQuery.order('updated_at', { ascending: false }).limit(1);
        }

        const { data: cvs } = await cvQuery;
        let resumeJson = null;

        if (cvs && cvs.length > 0) {
            resumeJson = cvs[0].resume_json;
        } else {
            // 1b. FALLBACK: Check if they have a LinkedIn import in 'profiles'
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (profiles && profiles.length > 0) {
                resumeJson = mapToResumeJSON(profiles[0].raw_json);
            }
        }

        if (!resumeJson) {
            return NextResponse.json({
                error: 'Henüz bir CV oluşturulmamış. Lütfen önce Dashboard sekmesinden bir CV oluşturun veya LinkedIn profilinizi içe aktarın.'
            }, { status: 404 });
        }

        // 2. Generate letter using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: LETTER_PROMPT },
                {
                    role: 'user',
                    content: `JOB DETAILS:
Title: ${job.title}
Company: ${job.companyName}
Location: ${job.location}
Description: ${job.descriptionText}

CANDIDATE PROFILE JSON:
${JSON.stringify(resumeJson)}

Write a tailored cover letter.`
                }
            ],
            temperature: 0.7,
        });

        const letter = completion.choices[0].message?.content || '';

        return NextResponse.json({ letter });

    } catch (error: any) {
        console.error('Letter Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate letter' }, { status: 500 });
    }
}
