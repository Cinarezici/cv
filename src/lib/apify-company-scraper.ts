import { ApifyWebCrawlerItem } from '@/types/motivation-letter';

const APIFY_BASE = 'https://api.apify.com/v2';
const WEBSITE_CRAWLER_ACTOR = 'apify~website-content-crawler';

export async function scrapeCompanyWebsite(
    urls: string[]
): Promise<ApifyWebCrawlerItem[]> {
    const TOKEN = process.env.APIFY_API_TOKEN;
    if (!TOKEN) {
        throw new Error('Apify API token is not configured.');
    }

    console.log(`Starting Apify Website Scraper for URLs: ${urls.join(', ')}`);

    try {
        const input = {
            startUrls: urls.map(url => ({ url })),
            maxCrawlPages: 5,
            maxCrawlDepth: 1,
            crawlerType: 'cheerio',
            removeCookieWarnings: true,
            useSitemapUrls: false,
        };

        // Start actor via REST API
        const startRes = await fetch(`${APIFY_BASE}/acts/${WEBSITE_CRAWLER_ACTOR}/runs?token=${TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });

        if (!startRes.ok) {
            const errText = await startRes.text();
            throw new Error(`Apify actor start failed (${startRes.status}): ${errText.slice(0, 200)}`);
        }

        const startData = await startRes.json();
        const runId = startData.data.id;
        const datasetId = startData.data.defaultDatasetId;

        // Poll until done (max 3 minutes)
        let status = 'RUNNING';
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${TOKEN}`);
            const runData = await runRes.json();
            status = runData.data?.status;
            if (status !== 'RUNNING' && status !== 'READY') break;
        }

        if (status !== 'SUCCEEDED') {
            throw new Error(`Apify crawler ended with status: ${status}`);
        }

        const dataRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${TOKEN}&limit=20&clean=true`);
        const items: any[] = dataRes.ok ? await dataRes.json() : [];

        if (!items || items.length === 0) {
            throw new Error('No company data retrieved from crawler. It may have been blocked or no content found.');
        }

        return items as unknown as ApifyWebCrawlerItem[];
    } catch (error: any) {
        console.error('Apify scrape error:', error);
        throw error;
    }
}
