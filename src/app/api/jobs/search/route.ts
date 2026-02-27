import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsageLimits, logJobSearch } from '@/lib/limits';

export const dynamic = 'force-dynamic';

const ACTOR_ID = 'curious_coder~linkedin-jobs-scraper'; // Note: ~ instead of / for API URL

export async function POST(request: NextRequest) {
    try {
        const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
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

        // Start the run via native fetch
        const response = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urls: [linkedInUrl],
                count: 100, // Minimum required by this actor
                scrapeCompany: true,
                proxy: {
                    useApifyProxy: true,
                    apifyProxyGroups: ['RESIDENTIAL']
                }
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Apify POST Error: ${response.status} - ${errBody}`);
        }

        const apifyData = await response.json();
        const run = apifyData.data;

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
        const { searchParams } = new URL(request.url);
        const runId = searchParams.get('runId');
        const datasetId = searchParams.get('datasetId');

        if (!runId || !datasetId) {
            return NextResponse.json({ error: 'Missing runId or datasetId' }, { status: 400 });
        }

        const runResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
        if (!runResponse.ok) {
            return NextResponse.json({ error: 'Run not found or API error' }, { status: runResponse.status });
        }

        const runData = await runResponse.json();
        const run = runData.data;

        if (run.status === 'RUNNING' || run.status === 'READY') {
            return NextResponse.json({ status: run.status });
        }

        if (run.status === 'SUCCEEDED') {
            const itemsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=50`);
            if (!itemsResponse.ok) {
                throw new Error(`Apify Dataset Error: ${itemsResponse.status}`);
            }
            const items = await itemsResponse.json() || [];

            const cleanedJobs = items
                .filter((j: any) => j.title && j.companyName)
                .map((j: any) => ({
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

        // If failed
        console.error(`Run failed logic: ${run.status}`);

        return NextResponse.json({
            status: run.status,
            error: `Job search ${run.status.toLowerCase()}. Details in server logs.`
        });

    } catch (error: any) {
        console.error('Job Status Poll Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
