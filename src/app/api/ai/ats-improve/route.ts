import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ATS_IMPROVE_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Your task: Rewrite this CV to be fully ATS-optimized. Fix ALL the issues identified in the analysis. Improve keyword density, strengthen action verbs, add quantification where possible, fix formatting signals, and remove filler words. Keep all factual information accurate — do not invent experience or credentials.

Return the improved CV as clean, structured text with clear section headers (CONTACT, SUMMARY, EXPERIENCE, EDUCATION, SKILLS). Use bullet points for achievements. Make it scannable and concise.`;

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

        const { cvText, atsResult, jobDescription } = await request.json();

        if (!cvText || !atsResult) {
            return NextResponse.json({ error: 'Missing CV text or ATS analysis.' }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }

        const anthropic = new Anthropic({ apiKey });

        let userMessage = `Here is the user's current CV:\n\n${cvText}\n\n---\n\nHere is the ATS analysis result:\n\nOverall Score: ${atsResult.overall_score}/100\n\nIssues found:\n`;

        if (atsResult.all_issues) {
            for (const issue of atsResult.all_issues) {
                userMessage += `- [${issue.priority.toUpperCase()}] ${issue.title}: ${issue.description}. Fix: ${issue.fix}\n`;
            }
        }

        if (jobDescription && jobDescription.trim().length > 0) {
            userMessage += `\n---\n\nTarget Job Description:\n${jobDescription}`;
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [
                { role: 'user', content: userMessage }
            ],
            system: ATS_IMPROVE_PROMPT,
        });

        const textBlock = message.content.find((b: any) => b.type === 'text');
        const improvedCV = textBlock ? (textBlock as any).text : '';

        return NextResponse.json({ improvedCV });
    } catch (error: any) {
        console.error('ATS Improve error:', error);
        return NextResponse.json({ error: error.message || 'Failed to improve CV' }, { status: 500 });
    }
}
