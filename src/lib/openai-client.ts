import { OpenAI } from 'openai';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
    if (!client) {
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error("CRITICAL: OPENAI_API_KEY is not defined in process.env");
            // Don't throw immediately, let the OpenAI client fail natively if it really needs to
            // so we can see if it's a false positive.
        }
        client = new OpenAI({
            apiKey: apiKey || 'dummy-key-to-prevent-crash',
            dangerouslyAllowBrowser: true // Just in case it's executing in intermediate edge runtime
        });
    }
    return client;
}
