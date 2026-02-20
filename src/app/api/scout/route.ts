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
            // Using a generic Apify job scraper actor proxy
            // Note: apimaestro/linkedin-jobs-scraper is a common one, but can be updated or configured.
            const run = await apify.actor('dan.scraper/linkedin-jobs-scraper').call({
                searchKeywords: [query],
                limit: 5,
            });
            const { items } = await apify.dataset(run.defaultDatasetId).listItems();
            results = items;
        } else if (type === 'people') {
            // Scrape similar people
            const run = await apify.actor('apimaestro/linkedin-search').call({
                searchQuery: query,
                searchType: 'people',
                limit: 5,
            });
            const { items } = await apify.dataset(run.defaultDatasetId).listItems();
            results = items;
        } else {
            return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Scout API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
