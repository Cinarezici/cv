import { getOpenAI } from './openai-client';
import { CompanyProfile, ApifyWebCrawlerItem } from '@/types/motivation-letter';
import { scrapeCompanyWebsite } from './apify-company-scraper';
import { createClient } from './supabase/server'; // Server component only



// Helpers
function extractDomain(url: string): string {
    try {
        const u = new URL(url);
        return u.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function extractCompanyNameFromUrl(url: string): string {
    const domain = extractDomain(url);
    const parts = domain.split('.');
    return parts.length > 0 ? parts[0] : domain;
}

export async function guessCompanyUrl(companyName: string): Promise<string[]> {
    const cleanName = companyName.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');

    const candidates = [
        `https://www.${cleanName}.com`,
        `https://${cleanName}.com`,
        `https://www.${cleanName}.io`,
        `https://${cleanName}.co`,
    ];

    // Simple test 
    for (const url of candidates) {
        try {
            const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
            if (res.ok) return [url, `${url}/about`, `${url}/careers`];
        } catch { } // ignore
    }

    return candidates.slice(0, 3);
}

// AI Mapping
export async function convertScrapedDataToProfile(
    scrapedItems: ApifyWebCrawlerItem[],
    companyUrl: string,
    companyName: string
): Promise<CompanyProfile> {
    const combinedText = scrapedItems
        .map(item => `=== ${item.url} ===\n${item.markdown || item.text}`)
        .join('\n\n')
        .substring(0, 20000); // safety block length

    const systemPrompt = `
You are a company research analyst. Extract structured information from the following scraped company website content.

Return ONLY valid JSON matching this exact schema:
{
  "name": "Company name",
  "industry": "Industry/sector",
  "founded": "Year or null",
  "headquartersLocation": "City, Country or null",
  "employeeCount": "e.g. '10,000+' or null",
  "mission": "Company mission statement (max 200 chars) or null",
  "vision": "Company vision or null",
  "values": ["value1", "value2"],
  "products": ["product1", "product2"],
  "recentNews": ["news item 1", "news item 2"],
  "cultureIndicators": ["indicator1", "indicator2"],
  "techStack": ["tech1", "tech2"],
  "painPoints": ["growth area 1", "challenge 1"],
  "competitivePosition": "Market position description or null",
  "keyAchievements": ["achievement 1", "achievement 2"],
  "dataQualityScore": 75
}

If information is not available, use null or empty array [].
dataQualityScore should reflect how much useful information was found (0-100).
`;

    const openai = getOpenAI();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Extract company profile from this website content:\n\n${combinedText}` }
            ],
            response_format: { type: "json_object" }
        });

        const jsonText = completion.choices[0].message?.content || '{}';
        const profile = JSON.parse(jsonText.replace(/```json | ```/g, '').trim());

        return {
            ...profile,
            website: companyUrl,
            scrapedPages: scrapedItems.map(i => i.url),
            scrapedAt: new Date().toISOString(),
        };
    } catch (e: any) {
        console.error('AI Profile extraction error:', e);
        return {
            name: companyName || extractCompanyNameFromUrl(companyUrl),
            website: companyUrl,
            industry: 'Unknown',
            values: [],
            products: [],
            recentNews: [],
            cultureIndicators: [],
            dataQualityScore: 10,
            scrapedPages: scrapedItems.map(i => i.url),
            scrapedAt: new Date().toISOString(),
        };
    }
}

// Orchestrator & Cache (Simplified: No guessing)
export async function getOrCreateCompanyProfile(
    userId: string,
    companyUrl: string,
    companyName: string
): Promise<{ profile: CompanyProfile; companyProfileId: string }> {

    const domain = extractDomain(companyUrl);
    const supabase = await createClient();

    // Check valid cache (within 24 hours)
    const { data: cached } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('company_domain', domain)
        .eq('scrape_status', 'completed')
        .gt('cache_expires_at', new Date().toISOString())
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single();

    if (cached) {
        return { profile: cached.structured_profile as CompanyProfile, companyProfileId: cached.id };
    }

    // Direct URLs only
    const targetUrls = [companyUrl, `${companyUrl} /about`, `${companyUrl}/careers`];

    let rawItems: ApifyWebCrawlerItem[] = [];
    let scrapeError = null;

    try {
        rawItems = await scrapeCompanyWebsite(targetUrls);
    } catch (e: any) {
        scrapeError = e.message;
        console.error("Apify Scrape failed:", e.message);
    }

    // Build the AI model mapping
    const structured_profile = await convertScrapedDataToProfile(
        rawItems,
        companyUrl,
        companyName
    );

    const scraped_at = new Date();
    const cache_expires_at = new Date();
    cache_expires_at.setHours(cache_expires_at.getHours() + 24);

    // Persist to DB
    const { data: profileRow, error } = await supabase.from('company_profiles').insert({
        user_id: userId,
        company_name: structured_profile.name,
        company_url: structured_profile.website,
        company_domain: extractDomain(structured_profile.website),
        raw_scraped_text: JSON.stringify(rawItems.map(i => i.markdown || i.text)),
        structured_profile,
        scrape_status: scrapeError ? 'failed' : 'completed',
        scrape_error: scrapeError,
        scraped_at: scraped_at.toISOString(),
        cache_expires_at: cache_expires_at.toISOString()
    }).select().single();

    if (error) {
        console.error("Supabase insert company_profiles error:", error);
    }

    return {
        profile: structured_profile,
        companyProfileId: profileRow?.id || ''
    };
}
