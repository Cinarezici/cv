import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { checkUsage, incrementUsage } from '@/lib/usage-enforcement';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ATS_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the provided resume and return a JSON object with this exact structure:

{
  "overall_score": <number 0-100>,
  "optimization_ready": <true/false>,
  "best_practices_compliant": <true/false>,
  "application_ready": <true/false>,
  "categories": {
    "formatting": { "score": <0-20>, "max": 20, "summary": "<string>", "issues": [] },
    "keywords": { "score": <0-20>, "max": 20, "summary": "<string>", "issues": [] },
    "experience_quality": { "score": <0-20>, "max": 20, "summary": "<string>", "issues": [] },
    "content_language": { "score": <0-20>, "max": 20, "summary": "<string>", "issues": [] },
    "section_completeness": { "score": <0-20>, "max": 20, "summary": "<string>", "issues": [] }
  },
  "all_issues": [
    {
      "id": "<string>",
      "title": "<string>",
      "description": "<string>",
      "fix": "<string>",
      "priority": "high" | "medium" | "low",
      "category": "<string>"
    }
  ],
  "strengths": [
    "<string>",
    "<string>",
    "<string>"
  ],
  "missing_keywords": [
    {
      "keyword": "<string>",
      "importance": "critical" | "important" | "nice-to-have"
    }
  ]
}

Evaluate against these 23 checkpoints:
FORMATTING (20pts): proper file structure signals, no tables/columns, readable font signals, page length appropriateness, consistent spacing, bullet point formatting, section header clarity, no images/graphics signals, proper date formatting, no headers/footers issues
KEYWORDS (20pts): keyword density, industry-specific terminology, skills section completeness, job title alignment, missing critical keywords, keyword variety
EXPERIENCE QUALITY (20pts): action verb strength, quantified achievements, result-oriented language, progression clarity, relevancy
CONTENT & LANGUAGE (20pts): no personal pronouns, no buzzwords/filler, professional tone, grammar signals, conciseness
SECTION COMPLETENESS (20pts): contact info, professional summary, work experience, education, skills, optional but valuable sections

ADDITIONAL SCORING RULES:

CAR METHOD CHECK: Evaluate every bullet point for Challenge-Action-Result structure. Flag bullets missing quantified results (numbers, %, $, time saved) as HIGH impact issues. Flag weak action verbs (made, did, helped, worked, used) and suggest stronger alternatives.

PUNCTUATION CONSISTENCY: Every bullet point must start with a capital letter and end with a period. Flag violations as MEDIUM impact issues.

EXPERIENCE LEVEL ADAPTATION: Detect the candidate seniority from their CV (Intern / Entry / Junior / Mid-Senior / Director / Executive) and adjust scoring thresholds:
- Entry level: 1-page strict, 3-6 bullets per role
- Mid-Senior: up to 2 pages acceptable, 4-8 bullets per role
- Director+: 2 pages recommended, executive summary required

STRENGTHS SECTION: Populate the strengths array with 3-5 specific things the resume does well.

KEYWORD GAP ANALYSIS: If a job description is provided, populate the missing_keywords array with the top 10 missing keywords, each tagged with importance level. If no JD is provided, return an empty array for missing_keywords.

Set optimization_ready to true if overall_score >= 70.
Set best_practices_compliant to true if there are no HIGH impact formatting issues.
Set application_ready to true if overall_score >= 60 and at least contact info + experience + education are present.

Return ONLY valid JSON, no markdown, no explanation.`;

/** Decode pdf2json URL-encoded tokens from page data */
function extractTextFromPdfJson(pdfData: any): string {
    const lines: string[] = [];
    for (const page of (pdfData.Pages || [])) {
        const pageLines: string[] = [];
        for (const text of (page.Texts || [])) {
            const decoded = text.R?.map((r: any) => {
                const token = r.T || '';
                try {
                    return decodeURIComponent(token);
                } catch (e) {
                    return token; // fallback to raw token if improperly encoded
                }
            }).join('') || '';
            if (decoded.trim()) pageLines.push(decoded.trim());
        }
        if (pageLines.length) lines.push(pageLines.join(' '));
    }
    return lines.join('\n');
}


export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check usage limits first
        const usageCheck = await checkUsage(user.id, 'ats_scan');
        if (!usageCheck.allowed) {
            return NextResponse.json({ 
                error: (usageCheck as any).message || (usageCheck.reason === 'limit_exceeded'
                    ? 'ATS Scan limit reached for your current plan. Please upgrade to continue.'
                    : 'A subscription is required for ATS Scanning.'),
                code: 'LIMIT_REACHED' 
            }, { status: 403 });
        }

        const contentType = request.headers.get('content-type') || '';
        let cvText = '';
        let jobDescription = '';
        let fileName = '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;
            jobDescription = (formData.get('jobDescription') as string) || '';
            cvText = (formData.get('cvText') as string) || '';
            fileName = file?.name || '';

            if (file && file.size > 0) {
                const bytes = await file.arrayBuffer();

                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    // Use token-by-token extraction to avoid URL-encoded garbage from getRawTextContent()
                    const PDFParser = (await import('pdf2json')).default;
                    const pdfData = await new Promise<any>((resolve, reject) => {
                        // @ts-ignore
                        const parser = new PDFParser(null, 1);
                        parser.on('pdfParser_dataError', (e: any) => reject(e.parserError));
                        parser.on('pdfParser_dataReady', (data: any) => resolve(data));
                        parser.parseBuffer(Buffer.from(bytes));
                    });
                    cvText = extractTextFromPdfJson(pdfData);
                } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                    const mammoth = await import('mammoth');
                    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
                    cvText = result.value;
                } else {
                    cvText = new TextDecoder().decode(bytes);
                }
            }
        } else {
            const body = await request.json();
            cvText = body.cvText || '';
            jobDescription = body.jobDescription || '';
        }

        if (!cvText || cvText.trim().length < 50) {
            return NextResponse.json({ error: 'CV text is too short or empty. Please provide a valid CV.' }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Anthropic API key is missing. Please add ANTHROPIC_API_KEY to your env.' }, { status: 500 });
        }

        const anthropic = new Anthropic({
            apiKey,
            defaultHeaders: { 'anthropic-beta': 'prompt-caching-2024-07-31' },
        });

        let userMessage = `Here is the resume to analyze:\n\n${cvText}`;
        if (jobDescription && jobDescription.trim().length > 0) {
            userMessage += `\n\n---\n\nTarget Job Description:\n${jobDescription}`;
        } else {
            userMessage += `\n\n---\n\nNo job description provided. Return an empty array for missing_keywords.`;
        }

        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 4096,
            // @ts-ignore — cache_control is valid when the prompt-caching beta header is set
            system: [
                {
                    type: 'text',
                    text: ATS_ANALYSIS_PROMPT,
                    cache_control: { type: 'ephemeral' },
                },
            ],
            messages: [{ role: 'user', content: userMessage }],
        });

        const textBlock = message.content.find((b: any) => b.type === 'text');
        let rawText = textBlock ? (textBlock as any).text : '{}';

        // Extract JSON specifically from within <json> tags if available
        const jsonStart = rawText.indexOf('<json>');
        const jsonEnd = rawText.lastIndexOf('</json>');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            rawText = rawText.substring(jsonStart + 6, jsonEnd);
        } else {
            // Fallback: Extract from first { to last }
            const startIdx = rawText.indexOf('{');
            const endIdx = rawText.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
                rawText = rawText.substring(startIdx, endIdx + 1);
            }
        }

        // Clean up common Claude JSON formatting errors before parsing
        // Replace unescaped newlines within strings with a space to prevent JSON.parse from failing
        let cleanedText = rawText;
        try {
            // A simple regex to replace newlines that are inside the JSON block but aren't escaped
            // This is a naive cleanup; JSON.parse might still fail if there are unescaped quotes
            cleanedText = rawText.replace(/\\n/g, '\\\\n').replace(/\n/g, ' ').replace(/\r/g, '');
        } catch (e) {
            // ignore cleanup errors
        }

        let result;
        try {
            result = JSON.parse(cleanedText);
        } catch (parseError) {
            // Ultimate fallback to evaluate as JS object if JSON.parse still fails due to trailing commas or quotes
            try {
                result = new Function('return ' + rawText.trim())();
            } catch (jsError) {
                console.error('Failed to parse Claude ATS response. Raw Text was:\n', rawText);
                console.error('Parse error:', parseError);
                return NextResponse.json({ error: 'AI returned an invalid response. Please try again.' }, { status: 500 });
            }
        }

        // Save scan to DB
        const { data: savedScan } = await supabase
            .from('ats_scans')
            .insert({
                user_id: user.id,
                file_name: fileName || 'Pasted Text',
                overall_score: result.overall_score,
                result,
                cv_text: cvText,
                job_description: jobDescription || null,
            })
            .select('id')
            .single();

        // Increment usage
        if (usageCheck.periodStart) {
            await incrementUsage(user.id, 'ats_scan', usageCheck.periodStart);
        }

        return NextResponse.json({ result, cvText, scanId: savedScan?.id });
    } catch (error: any) {
        console.error('ATS Scan error:', error);
        return NextResponse.json({ error: error.message || 'Failed to analyze CV' }, { status: 500 });
    }
}
