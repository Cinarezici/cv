import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApifyClient } from 'apify-client';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
        const apify = new ApifyClient({ token: token || 'dummy' });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!token) {
            return NextResponse.json({ error: 'Apify API Token is missing' }, { status: 500 });
        }

        const { query, type, location } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        let results = [];

        // Check search limits
        const { allowed, reason } = await checkUsageLimits(user.id, 'search_jobs');
        if (!allowed) {
            return NextResponse.json({ error: 'limit_reached', message: reason }, { status: 403 });
        }

        if (type === 'jobs') {
            await logJobSearch(user.id, query);
            const searchLocation = location || 'Worldwide';
            // curious_coder/linkedin-jobs-scraper
            const run = await apify.actor('curious_coder/linkedin-jobs-scraper').call({
                urls: [{ url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(searchLocation)}` }],
                maxJobs: 50,
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
        } else if (type === 'job-details') {
            // Specifically scrape a single job URL to extract details
            const run = await apify.actor('curious_coder/linkedin-jobs-scraper').call({
                urls: [{ url: query }],
                count: 1,
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
