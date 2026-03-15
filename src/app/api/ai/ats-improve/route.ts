import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 90;

const ATS_IMPROVE_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Your task: Rewrite this CV to be fully ATS-optimized. Fix ALL the issues identified in the analysis. Improve keyword density, strengthen action verbs, add quantification where possible, fix formatting signals, and remove filler words. Apply the CAR method (Challenge, Action, Result) to every bullet point — each bullet should describe a challenge or context, the action taken, and the measurable result (use numbers, %, $, time saved wherever reasonable). Ensure punctuation consistency: every bullet must start with a capital letter and end with a period. Keep all factual information accurate — do not invent experience or credentials. Return the improved CV as clean, structured text with clear section headers (CONTACT, SUMMARY, EXPERIENCE, EDUCATION, SKILLS). Use bullet points prefixed with "•" for achievements.`;

const PARSE_TO_JSON_PROMPT = `You are a resume parser. Convert the provided CV text into a JSON object with this exact structure. Extract the factual information only — do not add or invent anything.

{
  "header": {
    "full_name": "<string>",
    "headline": "<string - job title/current role>",
    "email": "<string>",
    "phone": "<string>",
    "location": "<string>",
    "linkedin": "<string>",
    "website": "<string>",
    "show_photo": false
  },
  "summary": "<string - professional summary paragraph>",
  "experience": [
    {
      "id": "<uuid string>",
      "company": "<string>",
      "role": "<string>",
      "start_date": "<string>",
      "end_date": "<string or 'Present'>",
      "location": "<string>",
      "bullets": ["<string>", "<string>"]
    }
  ],
  "education": [
    {
      "id": "<uuid string>",
      "institution": "<string>",
      "degree": "<string>",
      "field": "<string>",
      "start_date": "<string>",
      "end_date": "<string>",
      "gpa": "<string or null>"
    }
  ],
  "skills": {
    "core": ["<string>"],
    "tools": ["<string>"]
  }
}

Return ONLY valid JSON, no markdown, no explanation.`;

function extractJson(text: string): any {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end >= start) {
        try { return JSON.parse(text.substring(start, end + 1)); } catch { return null; }
    }
    return null;
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Pro check
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        const isPro = ['active'].includes(sub?.status as string);
        if (!isPro) {
            return NextResponse.json({
                error: 'ATS CV Improvement is a Pro feature. Please upgrade.',
                code: 'PRO_REQUIRED'
            }, { status: 403 });
        }

        const { cvText, atsResult, jobDescription, scanId } = await request.json();

        if (!cvText || !atsResult) {
            return NextResponse.json({ error: 'Missing CV text or ATS analysis.' }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Anthropic API key is missing.' }, { status: 500 });
        }

        const anthropic = new Anthropic({ apiKey });

        // Build the rewrite prompt
        let userMessage = `Here is the user's current CV:\n\n${cvText}\n\n---\n\nHere is the ATS analysis result:\n\nOverall Score: ${atsResult.overall_score}/100\n\nIssues to fix:\n`;
        if (atsResult.all_issues) {
            for (const issue of atsResult.all_issues) {
                userMessage += `- [${issue.priority.toUpperCase()}] ${issue.title}: ${issue.description}. Fix: ${issue.fix}\n`;
            }
        }
        if (jobDescription && jobDescription.trim().length > 0) {
            userMessage += `\n---\n\nTarget Job Description:\n${jobDescription}`;
            if (atsResult.missing_keywords?.length > 0) {
                userMessage += `\n\nMissing keywords to incorporate: ${atsResult.missing_keywords.map((k: any) => k.keyword).join(', ')}`;
            }
        }

        // Step 1: Generate improved CV text
        const improveMsg = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 4096,
            messages: [{ role: 'user', content: userMessage }],
            system: ATS_IMPROVE_PROMPT,
        });

        const improveTxtBlock = improveMsg.content.find((b: any) => b.type === 'text');
        const improvedCV = improveTxtBlock ? (improveTxtBlock as any).text : '';

        // Step 2: Parse improved CV into ResumeJSON for CV Builder pre-fill
        let structuredCV = null;
        try {
            const parseMsg = await anthropic.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 3000,
                messages: [{ role: 'user', content: `Convert this CV to JSON:\n\n${improvedCV}` }],
                system: PARSE_TO_JSON_PROMPT,
            });
            const parseTxtBlock = parseMsg.content.find((b: any) => b.type === 'text');
            const parsedRaw = parseTxtBlock ? (parseTxtBlock as any).text : '';
            const parsed = extractJson(parsedRaw);
            if (parsed) {
                // Ensure IDs exist on array items
                if (parsed.experience) {
                    parsed.experience = parsed.experience.map((e: any) => ({ ...e, id: e.id || generateId(), bullets: e.bullets || [] }));
                }
                if (parsed.education) {
                    parsed.education = parsed.education.map((e: any) => ({ ...e, id: e.id || generateId() }));
                }
                structuredCV = parsed;
            }
        } catch (parseErr) {
            console.warn('Failed to parse improved CV to JSON, continuing without structured data:', parseErr);
        }

        // Save improved_cv and structuredCV back to the DB row
        if (scanId) {
            await supabase
                .from('ats_scans')
                .update({ improved_cv: improvedCV, structured_cv: structuredCV })
                .eq('id', scanId)
                .eq('user_id', user.id);
        }

        return NextResponse.json({ improvedCV, structuredCV });
    } catch (error: any) {
        console.error('ATS Improve error:', error);
        return NextResponse.json({ error: error.message || 'Failed to improve CV' }, { status: 500 });
    }
}
