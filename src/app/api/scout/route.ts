import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

const APIFY_BASE = 'https://api.apify.com/v2';

async function runActorAndWait(token: string, actorId: string, input: object): Promise<any[]> {
    // Start actor run via REST API
    const startRes = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (!startRes.ok) {
        const err = await startRes.text();
        throw new Error(`Apify actor start failed (${startRes.status}): ${err.slice(0, 300)}`);
    }

    const startData = await startRes.json();
    const runId = startData.data.id;
    const datasetId = startData.data.defaultDatasetId;

    // Poll until done (max 3 minutes)
    let status = 'RUNNING';
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`);
        const runData = await runRes.json();
        status = runData.data?.status;
        if (status !== 'RUNNING' && status !== 'READY') break;
    }

    if (status !== 'SUCCEEDED') {
        throw new Error(`Apify run ended with status: ${status}`);
    }

    const dataRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&limit=50&clean=true`);
    return dataRes.ok ? await dataRes.json() : [];
}

export async function POST(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!token) {
            return NextResponse.json({ error: 'Apify API Token is missing. Please add APIFY_API_TOKEN to your Vercel Environment Variables.' }, { status: 500 });
        }

        const { query, type, location } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        // Check search limits
        const { allowed, reason } = await checkUsageLimits(user.id, 'search_jobs');
        if (!allowed) {
            return NextResponse.json({ error: 'limit_reached', message: reason }, { status: 403 });
        }

        let results: any[] = [];

        if (type === 'jobs') {
            await logJobSearch(user.id, query);
            const searchLocation = location || 'Worldwide';
            results = await runActorAndWait(token, 'curious_coder~linkedin-jobs-scraper', {
                urls: [`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(searchLocation)}`],
                count: 50,
            });
        } else if (type === 'people') {
            const items = await runActorAndWait(token, 'dev_fusion~linkedin-profile-scraper', {
                profileUrls: [query],
            });
            if (items && items.length > 0) {
                results = items[0].peopleAlsoViewed || items[0].relatedProfiles || items[0].similarProfiles || [];
            }
        } else if (type === 'job-details') {
            results = await runActorAndWait(token, 'curious_coder~linkedin-jobs-scraper', {
                urls: [query],
                count: 1,
            });
        } else {
            return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Scout API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
