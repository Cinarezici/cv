import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

// Ensure APIFY_API_TOKEN is set in your .env.local and Vercel environment variables

async function callApifyActor(actorId: string, input: any, token: string) {
    // Start run with 4GB memory to prevent OOM
    const safeActorId = actorId.replace('/', '~');
    const startRes = await fetch(`https://api.apify.com/v2/acts/${safeActorId}/runs?token=${token}&memory=4096`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    if (!startRes.ok) throw new Error(`Failed to start actor: ${await startRes.text()}`);
    let run = (await startRes.json()).data;

    // Poll for completion
    while (run.status === 'RUNNING' || run.status === 'READY') {
        await new Promise(r => setTimeout(r, 2000));
        const checkRes = await fetch(`https://api.apify.com/v2/actor-runs/${run.id}?token=${token}`);
        if (!checkRes.ok) throw new Error(`Failed to check run: ${await checkRes.text()}`);
        run = (await checkRes.json()).data;
    }

    if (run.status !== 'SUCCEEDED') throw new Error(`Actor run failed with status: ${run.status}`);

    // Fetch dataset
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${token}`);
    if (!datasetRes.ok) throw new Error(`Failed to fetch dataset: ${await datasetRes.text()}`);
    return await datasetRes.json();
}

export async function POST(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
        if (!token) throw new Error('APIFY_API_TOKEN is missing');

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { query, type, location } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        let results: any[] = [];

        // Check search limits
        const { allowed, reason } = await checkUsageLimits(user.id, 'search_jobs');
        if (!allowed) {
            return NextResponse.json({ error: 'limit_reached', message: reason }, { status: 403 });
        }

        if (type === 'jobs') {
            await logJobSearch(user.id, query);
            const searchLocation = location || 'Worldwide';
            const items = await callApifyActor('curious_coder/linkedin-jobs-scraper', {
                urls: [`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(searchLocation)}`],
                count: 100, // Minimal limit required by actor
                proxy: {
                    useApifyProxy: true,
                    apifyProxyGroups: ['RESIDENTIAL']
                }
            }, token);
            results = items || [];
        } else if (type === 'people') {
            const items = await callApifyActor('dev_fusion/linkedin-profile-scraper', {
                profileUrls: [query],
            }, token);
            if (items && items.length > 0) {
                results = (items[0].peopleAlsoViewed || items[0].relatedProfiles || items[0].similarProfiles || []) as any[];
            }
        } else if (type === 'job-details') {
            const items = await callApifyActor('curious_coder/linkedin-jobs-scraper', {
                urls: [query],
                count: 100,
                proxy: {
                    useApifyProxy: true,
                    apifyProxyGroups: ['RESIDENTIAL']
                }
            }, token);
            results = items || [];
        } else {
            return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Scout API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
