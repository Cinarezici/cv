import { ApifyWebCrawlerItem } from '@/types/motivation-letter';

// Ensure APIFY_API_TOKEN is set in your .env.local and Vercel environment variables
const WEBSITE_CRAWLER_ACTOR = 'apify~website-content-crawler'; // Note: ~ instead of / for API URLs

export async function scrapeCompanyWebsite(
    urls: string[]
): Promise<ApifyWebCrawlerItem[]> {
    const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
    if (!token) throw new Error('APIFY_API_TOKEN is missing');

    console.log(`Starting Apify Website Scraper for URLs: ${urls.join(', ')}`);

    try {
        // 1. Run the actor
        const input = {
            startUrls: urls.map(url => ({ url })),
            maxCrawlPages: 5,
            maxCrawlDepth: 1,
            crawlerType: 'cheerio', // Fast lightweight scraping
            removeCookieWarnings: true,
            useSitemapUrls: false,
        };

        const startRes = await fetch(`https://api.apify.com/v2/acts/${WEBSITE_CRAWLER_ACTOR}/runs?token=${token}&memory=2048`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });
        if (!startRes.ok) throw new Error(`Failed to start actor: ${await startRes.text()}`);
        let run = (await startRes.json()).data;

        // 2. Poll for completion
        while (run.status === 'RUNNING' || run.status === 'READY') {
            await new Promise(r => setTimeout(r, 2000));
            const checkRes = await fetch(`https://api.apify.com/v2/actor-runs/${run.id}?token=${token}`);
            if (!checkRes.ok) throw new Error(`Failed to check run: ${await checkRes.text()}`);
            run = (await checkRes.json()).data;
        }

        if (run.status !== 'SUCCEEDED') throw new Error(`Actor run failed with status: ${run.status}`);

        if (!run || !run.defaultDatasetId) {
            throw new Error('No dataset ID returned from Apify');
        }

        // 3. Fetch data
        const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${token}`);
        if (!datasetRes.ok) throw new Error(`Failed to fetch dataset: ${await datasetRes.text()}`);
        const items = await datasetRes.json();

        if (!items || items.length === 0) {
            throw new Error('No company data retrieved from crawler. It may have been blocked or no content found.');
        }

        return items as unknown as ApifyWebCrawlerItem[];
    } catch (error: any) {
        console.error('Apify scrape error:', error);
        throw error;
    }
}
