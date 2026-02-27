import { ApifyClient } from 'apify-client';
import { ApifyWebCrawlerItem } from '@/types/motivation-letter';

// Ensure APIFY_API_TOKEN is set in your .env.local and Vercel environment variables
const WEBSITE_CRAWLER_ACTOR = 'apify/website-content-crawler';

export async function scrapeCompanyWebsite(
    urls: string[]
): Promise<ApifyWebCrawlerItem[]> {
    const token = process.env.APIFY_API_TOKEN || process.env.NEXT_PUBLIC_APIFY_API_TOKEN;
    const apify = new ApifyClient({ token: token });

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

        // 2. Fetch data
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
