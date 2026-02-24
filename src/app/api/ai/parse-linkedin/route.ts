import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';
import { ApifyClient } from 'apify-client';

const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

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
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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

      const isPro = sub?.status === 'active';
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

    let contentToParse = '';

    if (linkedinText) {
      // Manual Approach
      contentToParse = linkedinText;
    } else {
      // URL Approach
      if (!process.env.APIFY_API_TOKEN) {
        return NextResponse.json({ error: 'Apify API Token eksik. Lütfen Manuel seçeneği kullanın.' }, { status: 500 });
      }

      console.log(`Starting Apify Scraper for URL: ${linkedinUrl}`);
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        // We use apimaestro/linkedin-profile-detail as it allows API execution and is reliable
        // Apimaestro requires the 'username' param otherwise it defaults to a placeholder
        const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/]+)/i);
        const profileUsername = usernameMatch ? usernameMatch[1] : '';

        const run = await apify.actor('dev_fusion/linkedin-profile-scraper').call({
          profileUrls: [linkedinUrl]
        });

        const { items } = await apify.dataset(run.defaultDatasetId).listItems();
        if (!items || items.length === 0) {
          throw new Error('No data retrieved from LinkedIn! LinkedIn bot detection might have blocked the URL.');
        }
        contentToParse = JSON.stringify(items[0]);
      } catch (apifyErr: any) {
        const errMsg = apifyErr.message || '';
        if (errMsg.includes('paid Actor') || errMsg.includes('free trial has expired') || errMsg.includes('not found')) {
          return NextResponse.json({ error: 'Apify bot aktör limiti veya hatası. Lütfen "Manuel Metin" sekmesinden metni yapıştırarak devam edin (%100 Kesin Çözüm).' }, { status: 402 });
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
