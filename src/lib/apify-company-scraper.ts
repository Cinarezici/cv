import { ApifyClient } from 'apify-client';
import { ApifyWebCrawlerItem } from '@/types/motivation-letter';

// Fallback to fetch if client is not set up correctly
const APIFY_TOKEN = process.env.APIFY_API_TOKEN || '';
const WEBSITE_CRAWLER_ACTOR = 'apify~website-content-crawler';

export async function scrapeCompanyWebsite(
    urls: string[]
): Promise<ApifyWebCrawlerItem[]> {
    const apify = new ApifyClient({ token: APIFY_TOKEN });

    if (!APIFY_TOKEN) {
        throw new Error("Apify API token is not configured.");
    }

    // We use apify/website-content-crawler
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

        const run = await apify.actor(WEBSITE_CRAWLER_ACTOR).call(input);

        if (!run || !run.defaultDatasetId) {
            throw new Error('No run ID returned from Apify');
        }

        // 2. Poll & fetch data
        const { items } = await apify.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) {
            throw new Error('No company data retrieved from crawler. It may have been blocked or no content found.');
        }

        return items as unknown as ApifyWebCrawlerItem[];
    } catch (error: any) {
        console.error('Apify scrape error:', error);
        throw error;
    }
}
