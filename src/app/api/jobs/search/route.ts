import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApifyClient } from 'apify-client';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

const ACTOR_ID = 'curious_coder/linkedin-jobs-scraper';

// We will rely on environment variables to avoid committing secrets
// Ensure APIFY_API_TOKEN is set in your .env.local and Vercel environment variables

export async function POST(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
        const apify = new ApifyClient({ token: token });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { keywords, location } = await request.json();

        // Check search limits
        const { allowed, reason } = await checkUsageLimits(user.id, 'search_jobs');
        if (!allowed) {
            return NextResponse.json({ error: reason, code: 'LIMIT_REACHED' }, { status: 403 });
        }

        if (!keywords || keywords.trim().length < 2) {
            return NextResponse.json({ error: 'Please enter a valid job title.' }, { status: 400 });
        }

        const searchLocation = location?.trim() || 'Remote';
        const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(searchLocation)}&position=1&pageNum=0`;

        console.log(`Starting Job Search Run for ${keywords} in ${searchLocation}`);

        // Start the run via apify-client (no wait needed for POST)
        // Added proxy back because the user has provided a valid token with Residential proxy access
        const run = await apify.actor(ACTOR_ID).start({
            urls: [linkedInUrl],
            count: 100, // Minimum required by this actor
            scrapeCompany: true,
            proxy: {
                useApifyProxy: true,
                apifyProxyGroups: ['RESIDENTIAL']
            }
        });

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

export async function GET(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
        const apify = new ApifyClient({ token: token });
        const { searchParams } = new URL(request.url);
        const runId = searchParams.get('runId');
        const datasetId = searchParams.get('datasetId');

        if (!runId || !datasetId) {
            return NextResponse.json({ error: 'Missing runId or datasetId' }, { status: 400 });
        }

        const run = await apify.run(runId).get();
        if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });

        if (run.status === 'RUNNING' || run.status === 'READY') {
            return NextResponse.json({ status: run.status });
        }

        if (run.status === 'SUCCEEDED') {
            const { items } = await apify.dataset(datasetId).listItems({ limit: 50 });

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

        // If failed, try to get logs
        const log = await apify.run(runId).log().get();
        console.error(`Run failed logic: ${run.status}. Log snippet: ${typeof log === 'string' ? log.slice(-300) : 'N/A'}`);

        return NextResponse.json({
            status: run.status,
            error: `Job search ${run.status.toLowerCase()}. Details in server logs.`
        });

    } catch (error: any) {
        console.error('Job Status Poll Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
