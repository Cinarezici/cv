import { OpenAI } from 'openai';

let client: OpenAI | null = null;

/**
 * Returns a lazily-initialized OpenAI client.
 * Safe to import at module level — client creation is deferred until first call.
 */
export function getOpenAI(): OpenAI {
    if (!client) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set.');
        }
        client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return client;
}
