import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApifyClient } from 'apify-client';

const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!process.env.APIFY_API_TOKEN) {
            return NextResponse.json({ error: 'Apify API Token is missing' }, { status: 500 });
        }

        const { query, type } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        let results = [];

        if (type === 'jobs') {
            // curious_coder/linkedin-jobs-scraper
            const run = await apify.actor('curious_coder/linkedin-jobs-scraper').call({
                urls: [{ url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=Worldwide` }],
                count: 150,
            });
            const { items } = await apify.dataset(run.defaultDatasetId).listItems();
            results = items;
        } else if (type === 'people') {
            // dev_fusion/linkedin-profile-scraper for extracting similar profiles
            // The user must provide a profile URL for this query
            const run = await apify.actor('dev_fusion/linkedin-profile-scraper').call({
                profileUrls: [query],
            });
            const { items } = await apify.dataset(run.defaultDatasetId).listItems();
            if (items && items.length > 0) {
                // Return people Also Viewed or similar profiles available in the structure
                results = (items[0].peopleAlsoViewed || items[0].relatedProfiles || items[0].similarProfiles || []) as any[];
            }
        } else {
            return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Scout API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
