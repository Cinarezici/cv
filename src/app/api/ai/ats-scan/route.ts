import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ATS_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the provided resume and return a JSON object with this exact structure:

{
  "overall_score": <number 0-100>,
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
  ]
}

Evaluate against these 23 checkpoints:
FORMATTING (20pts): proper file structure signals, no tables/columns, readable font signals, page length appropriateness, consistent spacing, bullet point formatting, section header clarity, no images/graphics signals, proper date formatting, no headers/footers issues
KEYWORDS (20pts): keyword density, industry-specific terminology, skills section completeness, job title alignment, missing critical keywords, keyword variety
EXPERIENCE QUALITY (20pts): action verb strength, quantified achievements, result-oriented language, progression clarity, relevancy
CONTENT & LANGUAGE (20pts): no personal pronouns, no buzzwords/filler, professional tone, grammar signals, conciseness
SECTION COMPLETENESS (20pts): contact info, professional summary, work experience, education, skills, optional but valuable sections

If a Job Description is provided, also evaluate keyword alignment against that specific JD and adjust keyword scores accordingly.

Return ONLY valid JSON, no markdown, no explanation.`;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const contentType = request.headers.get('content-type') || '';

        let cvText = '';
        let jobDescription = '';

        if (contentType.includes('multipart/form-data')) {
            // Handle file upload
            const formData = await request.formData();
            const file = formData.get('file') as File | null;
            jobDescription = (formData.get('jobDescription') as string) || '';
            cvText = (formData.get('cvText') as string) || '';

            if (file && file.size > 0) {
                const bytes = await file.arrayBuffer();

                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    const PDFParser = (await import('pdf2json')).default;
                    cvText = await new Promise<string>((resolve, reject) => {
                        // @ts-ignore
                        const parser = new PDFParser(null, 1);
                        parser.on('pdfParser_dataError', (e: any) => reject(e.parserError));
                        parser.on('pdfParser_dataReady', () => resolve(parser.getRawTextContent()));
                        parser.parseBuffer(Buffer.from(bytes));
                    });
                } else if (file.name.endsWith('.docx')) {
                    const mammoth = await import('mammoth');
                    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
                    cvText = result.value;
                } else {
                    // Plain text
                    cvText = new TextDecoder().decode(bytes);
                }
            }
        } else {
            // JSON body
            const body = await request.json();
            cvText = body.cvText || '';
            jobDescription = body.jobDescription || '';
        }

        if (!cvText || cvText.trim().length < 50) {
            return NextResponse.json({ error: 'CV text is too short or empty. Please provide a valid CV.' }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY is not set');
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }

        const anthropic = new Anthropic({ apiKey });

        let userMessage = `Here is the resume to analyze:\n\n${cvText}`;
        if (jobDescription && jobDescription.trim().length > 0) {
            userMessage += `\n\n---\n\nTarget Job Description:\n${jobDescription}`;
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [
                { role: 'user', content: userMessage }
            ],
            system: ATS_ANALYSIS_PROMPT,
        });

        const textBlock = message.content.find((b: any) => b.type === 'text');
        const rawText = textBlock ? (textBlock as any).text : '{}';

        let result;
        try {
            result = JSON.parse(rawText);
        } catch {
            console.error('Failed to parse Claude ATS response:', rawText);
            return NextResponse.json({ error: 'AI returned an invalid response. Please try again.' }, { status: 500 });
        }

        // Return both the result and the extracted cvText so the client can use it for improvement
        return NextResponse.json({ result, cvText });
    } catch (error: any) {
        console.error('ATS Scan error:', error);
        return NextResponse.json({ error: error.message || 'Failed to analyze CV' }, { status: 500 });
    }
}
