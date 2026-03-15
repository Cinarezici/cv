import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function testScan() {
    console.log('Testing ATS Scan...');
    try {
        const formData = new FormData();
        formData.append("cvText", "John Doe. Software Engineer with 5 years of experience in React and Node.js. Developed multiple web applications and scalable APIs. Education: BSc in Computer Science, University of Technology.");
        formData.append("jobDescription", "Looking for a Software Engineer with React and Node.js experience to build web apps.");

        // Instead of querying the route, let's query Anthropic directly to see what it returns
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        
        // This is exactly what the route does:
        const ATS_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the provided resume and return a JSON object with this exact structure:
{
  "overall_score": <number 0-100>,
  "optimization_ready": <boolean>,
  "best_practices_compliant": <boolean>,
  "application_ready": <boolean>,
  "categories": {
    "formatting": { "score": <num 0-20>, "max": 20, "summary": "<string>", "issues": [{ "id": "<uuid>", "title": "<string>", "description": "<string>", "fix": "<string>", "priority": "high|medium|low", "category": "formatting" }] },
    "keywords": { "score": <num 0-20>, "max": 20, "summary": "<string>", "issues": [...] },
    "experience_quality": { "score": <num 0-20>, "max": 20, "summary": "<string>", "issues": [...] },
    "content_language": { "score": <num 0-20>, "max": 20, "summary": "<string>", "issues": [...] },
    "section_completeness": { "score": <num 0-20>, "max": 20, "summary": "<string>", "issues": [...] }
  },
  "all_issues": [ /* array of all issues from categories */ ],
  "strengths": ["<string>", "<string>"],
  "missing_keywords": [
    { "keyword": "<string>", "importance": "critical|important|nice-to-have" }
  ]
}

Return ONLY valid JSON, no markdown formatting, no explanations.`;

        let userMessage = `Here is the resume to analyze:\n\nJohn Doe. Software Engineer. React and Node.js.`;

        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 4096,
            system: [
                {
                    type: 'text',
                    text: ATS_ANALYSIS_PROMPT,
                    cache_control: { type: 'ephemeral' }
                }
            ],
            messages: [{ role: 'user', content: userMessage }],
        });

        const textBlock = message.content.find((b) => b.type === 'text');
        const rawText = textBlock ? textBlock.text : '{}';
        
        console.log("CLAUDE RAW RESPONSE:");
        console.log(rawText);
        
        const startIdx = rawText.indexOf('{');
        const endIdx = rawText.lastIndexOf('}');
        let jsonStr = rawText;
        if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
            jsonStr = rawText.substring(startIdx, endIdx + 1);
        }
        
        console.log("\nPARSING RESULT:");
        try {
            JSON.parse(jsonStr);
            console.log("OK!");
        } catch(e) {
            console.error("JSON PARSE ERROR:", e);
        }

    } catch (e) {
        console.error(e);
    }
}

testScan();
