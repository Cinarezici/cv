import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai-client';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const APIFY_BASE = 'https://api.apify.com/v2';

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
    const openai = getOpenAI();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { linkedinUrl, linkedinText } = await request.json();

    // Pro-only check for URL imports
    if (linkedinUrl) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const isPro = ['active'].includes(sub?.status as string);
      if (!isPro) {
        return NextResponse.json({
          error: 'LinkedIn URL import is a Pro feature. Please use the Manual Text option or upgrade to Pro.',
          code: 'PRO_REQUIRED'
        }, { status: 403 });
      }
    }

    if (!linkedinUrl && !linkedinText) {
      return NextResponse.json({ error: 'No URL or Text provided' }, { status: 400 });
    }

    // --- enforces maximum 4 profile limit ---
    const { count: profileCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error fetching profile count:', countError);
      return NextResponse.json({ error: 'Failed to verify profile limits.' }, { status: 500 });
    }

    if (profileCount && profileCount >= 4) {
      return NextResponse.json({
        error: 'Profile limit reached. You can have a maximum of 4 profiles. Please delete an older profile from the Create Base CV screen to add a new one.'
      }, { status: 403 });
    }
    // -----------------------------------------

    let contentToParse = '';

    if (linkedinText) {
      // Manual Approach
      contentToParse = linkedinText;
    } else {
      // URL Approach — using Apify REST API directly (no apify-client SDK needed)
      const TOKEN = process.env.APIFY_API_TOKEN;
      if (!TOKEN) {
        return NextResponse.json({ error: 'Apify API Token is missing. Please add APIFY_API_TOKEN to your Vercel Environment Variables.' }, { status: 500 });
      }

      console.log(`Starting Apify Scraper for URL: ${linkedinUrl}`);
      try {
        // Start actor via REST API
        const startRes = await fetch(`${APIFY_BASE}/acts/dev_fusion~linkedin-profile-scraper/runs?token=${TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileUrls: [linkedinUrl] }),
        });

        if (!startRes.ok) {
          const errBody = await startRes.text();
          throw new Error(`Apify start failed: ${startRes.status} — ${errBody.slice(0, 200)}`);
        }

        const startData = await startRes.json();
        const runId = startData.data.id;
        const datasetId = startData.data.defaultDatasetId;

        // Poll until done
        let status = 'RUNNING';
        for (let i = 0; i < 60; i++) {
          await new Promise(r => setTimeout(r, 3000));
          const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${TOKEN}`);
          const runData = await runRes.json();
          status = runData.data?.status;
          if (status !== 'RUNNING' && status !== 'READY') break;
        }

        if (status !== 'SUCCEEDED') {
          throw new Error(`Apify run ended with status: ${status}. Please try using the Manual Text option.`);
        }

        const dataRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${TOKEN}&limit=1&clean=true`);
        const items: any[] = dataRes.ok ? await dataRes.json() : [];

        if (!items || items.length === 0) {
          throw new Error('No data retrieved from LinkedIn! LinkedIn bot detection might have blocked the URL.');
        }
        contentToParse = JSON.stringify(items[0]);
      } catch (apifyErr: any) {
        const errMsg = apifyErr.message || '';
        if (errMsg.includes('paid Actor') || errMsg.includes('free trial has expired') || errMsg.includes('not found')) {
          return NextResponse.json({ error: 'Apify actor limit reached. Please use the "Manual Text" tab by pasting your LinkedIn profile text.' }, { status: 402 });
        }
        throw apifyErr;
      }
    }

    // Parse with GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PARSE_PROMPT },
        { role: 'user', content: contentToParse }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const resumeData = JSON.parse(completion.choices[0].message?.content || '{}');

    // Save to Supabase Profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: resumeData.name || 'Unknown',
        headline: resumeData.headline || '',
        raw_json: resumeData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Parse/Apify error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse profile' }, { status: 500 });
  }
}
