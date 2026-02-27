import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

const ACTOR_ID = 'curious_coder~linkedin-jobs-scraper';
const APIFY_BASE = 'https://api.apify.com/v2';

// POST: Start the job search run via Apify REST API
export async function POST(request: NextRequest) {
    try {
        const TOKEN = process.env.APIFY_API_TOKEN;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!TOKEN) {
            return NextResponse.json({ error: 'Apify API Token is missing. Please add APIFY_API_TOKEN to your Vercel Environment Variables.' }, { status: 500 });
        }

        const { keywords, location } = await request.json();

        // --- CHECK LIMITS BEFORE SEARCHING ---
        const { allowed, reason } = await checkUsageLimits(user.id, 'search_jobs');
        if (!allowed) {
            return NextResponse.json({ error: reason, code: 'LIMIT_REACHED' }, { status: 403 });
        }

        if (!keywords || keywords.trim().length < 2) {
            return NextResponse.json({ error: 'Please enter a valid job title.' }, { status: 400 });
        }

        const searchLocation = location?.trim() || 'Remote';
        const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(searchLocation)}&position=1&pageNum=0`;

        // Start actor via REST API (no apify-client needed)
        const startRes = await fetch(`${APIFY_BASE}/acts/${ACTOR_ID}/runs?token=${TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urls: [linkedInUrl],
                count: 100,
                scrapeCompany: true,
                proxy: {
                    useApifyProxy: true,
                    apifyProxyGroups: ['RESIDENTIAL']
                }
            })
        });

        if (!startRes.ok) {
            const errText = await startRes.text();
            console.error('Apify start error:', errText);
            throw new Error(`Apify actor start failed: ${startRes.status}`);
        }

        const startData = await startRes.json();
        const run = startData.data;

        // Log the search action
        await logJobSearch(user.id, `${keywords} in ${searchLocation}`);

        return NextResponse.json({
            success: true,
            runId: run.id,
            datasetId: run.defaultDatasetId,
            status: run.status
        });

    } catch (error: any) {
        console.error('Job Search Start Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Check status and get results via Apify REST API
export async function GET(request: NextRequest) {
    try {
        const TOKEN = process.env.APIFY_API_TOKEN;
        if (!TOKEN) {
            return NextResponse.json({ error: 'Apify API Token is missing.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const runId = searchParams.get('runId');
        const datasetId = searchParams.get('datasetId');

        if (!runId || !datasetId) {
            return NextResponse.json({ error: 'Missing runId or datasetId' }, { status: 400 });
        }

        // Get run status
        const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${TOKEN}`);
        if (!runRes.ok) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
        const runData = await runRes.json();
        const run = runData.data;

        if (run.status === 'RUNNING' || run.status === 'READY') {
            return NextResponse.json({ status: run.status });
        }

        if (run.status === 'SUCCEEDED') {
            // Fetch dataset items
            const dataRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${TOKEN}&limit=50&clean=true`);
            const items: any[] = dataRes.ok ? await dataRes.json() : [];

            const cleanedJobs = items
                .filter(j => j.title && j.companyName)
                .map(j => ({
                    id: j.id || Math.random().toString(36).substr(2, 9),
                    title: j.title,
                    companyName: j.companyName,
                    companyLogo: j.companyLogo || null,
                    location: j.location || 'Unknown',
                    link: j.link || '',
                    postedAt: j.postedAt || new Date().toISOString(),
                    applicantsCount: j.applicantsCount || null,
                    employmentType: j.employmentType || null,
                    seniorityLevel: j.seniorityLevel || null,
                    descriptionText: j.descriptionText || '',
                    salaryInfo: Array.isArray(j.salaryInfo) ? j.salaryInfo : [],
                    benefits: Array.isArray(j.benefits) ? j.benefits : [],
                }));

            return NextResponse.json({
                status: 'SUCCEEDED',
                jobs: cleanedJobs,
                total: cleanedJobs.length
            });
        }

        return NextResponse.json({
            status: run.status,
            error: `Job search ${run.status.toLowerCase()}. Please try again.`
        });

    } catch (error: any) {
        console.error('Job Status Poll Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
