import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ai/improve-text
 * Improves a given CV text block using OpenAI GPT-4o-mini.
 *
 * Body: { text: string, section: string, context?: string }
 * Returns: { improved: string }
 *
 * Requires OPENAI_API_KEY in .env.local
 */
export async function POST(req: NextRequest) {
    try {
        const { text, section, context } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env.local' },
                { status: 503 }
            );
        }

        if (!text?.trim()) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const systemPrompt = `You are a professional CV writer. Your task is to improve the given text to be more impactful, professional, and achievement-focused.

Rules:
- Use strong action verbs (Led, Spearheaded, Delivered, Achieved, etc.)
- Quantify achievements where possible (use placeholders like [X%] if no numbers given)
- Keep it concise and bullet-point friendly
- Do NOT add fictional details — only enhance what's given
- Return ONLY the improved text, no explanations
- Match the original language (Turkish or English)`;

        const userPrompt = section === 'experience'
            ? `Improve this work experience description:\n\n${text}${context ? `\n\nContext (role/company): ${context}` : ''}`
            : section === 'summary'
                ? `Improve this professional summary:\n\n${text}`
                : `Improve this CV text for section "${section}":\n\n${text}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        const improved = data.choices?.[0]?.message?.content?.trim();

        return NextResponse.json({ improved });
    } catch (err: any) {
        console.error('improve-text error:', err);
        return NextResponse.json({ error: err.message || 'Failed to improve text' }, { status: 500 });
    }
}
