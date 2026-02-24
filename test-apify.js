const { ApifyClient } = require('apify-client');
require('dotenv').config({ path: '.env.local' });

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

if (!APIFY_API_TOKEN) {
    console.error('No APIFY_API_TOKEN found in .env.local');
    process.exit(1);
}

const apify = new ApifyClient({ token: APIFY_API_TOKEN });
const ACTOR_ID = 'curious_coder/linkedin-jobs-scraper';

async function main() {
    const linkedInUrl = 'https://www.linkedin.com/jobs/search/?keywords=software&location=Germany&position=1&pageNum=0';

    console.log('Starting actor...');

    try {
        const run = await apify.actor(ACTOR_ID).start({
            urls: [linkedInUrl], // MUST be an array of strings per actor schema
            count: 100, // Fixed to 100 as per actor requirements
            scrapeCompany: true,
            proxy: {
                useApifyProxy: true,
                apifyProxyGroups: ['RESIDENTIAL']
            }
        });

        console.log(`Run started: ${run.id}, status: ${run.status}`);

        // Poll the status
        let currentRun;
        do {
            await new Promise(r => setTimeout(r, 3000));
            currentRun = await apify.run(run.id).get();
            console.log(`Run status: ${currentRun.status}`);
        } while (currentRun.status === 'RUNNING' || currentRun.status === 'READY');

        if (currentRun.status === 'SUCCEEDED') {
            const { items } = await apify.dataset(run.defaultDatasetId).listItems({ limit: 10 });
            console.log(`Success! Found ${items.length} jobs.`);
            console.log(items[0] ? items[0].title : 'No items text');
        } else {
            console.error('Run failed!');
            const log = await apify.run(run.id).log().get();
            console.error(typeof log === 'string' ? log.slice(0, 1000) : log);
        }
    } catch (err) {
        console.error('Error starting or polling actor:', err);
    }
}

main();
