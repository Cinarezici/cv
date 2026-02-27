import { OpenAI } from 'openai';

export function getOpenAI(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error(
            'OPENAI_API_KEY is not configured. Please add it to your environment variables (Vercel Dashboard > Settings > Environment Variables).'
        );
    }
    return new OpenAI({ apiKey });
}
