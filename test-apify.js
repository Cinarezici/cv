const { ApifyClient } = require('apify-client');
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
client.actor('curious_coder/linkedin-jobs-scraper').version('latest').get().then(console.log).catch(console.error);
