import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';
// Mock DOMMatrix for pdf-parse in Next.js backend environment
if (typeof global !== "undefined" && !global.DOMMatrix) {
  (global as any).DOMMatrix = class { };
}
const pdfParse = require('pdf-parse');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PARSE_PROMPT = `You are a resume parser. Extract information from the structured LinkedIn profile data or raw text below and return ONLY a valid JSON object with this exact structure:
{
  "name": "Full Name",
  "headline": "Professional headline",
  "email": "email if found",
  "phone": "phone if found", 
  "location": "City, Country",
  "summary": "About section text",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "bullets": ["Achievement or responsibility 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "YYYY",
      "gpa": "GPA if mentioned"
    }
  ],
  "skills": ["Skill 1", "Skill 2"]
}

STRICT RULES:
- Return ONLY the JSON, no explanation
- Never invent data not present in the text
- If a field is not found, use empty string or empty array
- bullets must be an array of strings`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF text
    const pdfData = await pdfParse(buffer);
    const textToParse = pdfData.text;

    if (!textToParse || textToParse.trim().length === 0) {
      return NextResponse.json({ error: 'No readable text in PDF' }, { status: 400 });
    }

    // Parse with GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PARSE_PROMPT },
        { role: 'user', content: textToParse }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const resumeData = JSON.parse(completion.choices[0].message?.content || '{}');

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: resumeData.name || 'Unknown',
        headline: resumeData.headline || '',
        raw_json: resumeData,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('PDF Parse error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse PDF' }, { status: 500 });
  }
}
