import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApifyClient } from 'apify-client';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const apify = new ApifyClient({ token: APIFY_API_TOKEN });
const ACTOR_ID = 'curious_coder/linkedin-jobs-scraper';

// POST: Start the job search run
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!APIFY_API_TOKEN) {
            return NextResponse.json({ error: 'Apify API Token is missing' }, { status: 500 });
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

        // Start the run without waiting for it to finish
        const run = await apify.actor(ACTOR_ID).start({
            urls: [linkedInUrl], // MUST be an array of strings per actor schema
            count: 100,
            scrapeCompany: true,
            proxy: {
                useApifyProxy: true,
                apifyProxyGroups: ['RESIDENTIAL']
            }
        });

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

// Helper to log once the search succeeds (handled in polling now or here)
// Actually, it's better to log as soon as the run is started successfully.
async function performLogging(userId: string, keywords: string, location: string) {
    await logJobSearch(userId, `${keywords} in ${location}`);
}

// GET: Check status and get results
export async function GET(request: NextRequest) {
    try {
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
        console.error(`Run failed logic: ${run.status}. Log snippet: ${typeof log === 'string' ? log.slice(0, 300) : 'N/A'}`);

        return NextResponse.json({
            status: run.status,
            error: `Job search ${run.status.toLowerCase()}. Details in server logs.`
        });

    } catch (error: any) {
        console.error('Job Status Poll Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
