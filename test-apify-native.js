require('dotenv').config({ path: '.env.local' });
const token = process.env.APIFY_API_TOKEN;
console.log('Token exists:', !!token);
const url = 'https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/runs?token=' + token;
const linkedInUrl = 'https://www.linkedin.com/jobs/search/?keywords=software&location=Germany&position=1&pageNum=0';
fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        urls: [linkedInUrl],
        count: 100,
        scrapeCompany: true,
        proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] }
    })
}).then(res => res.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
    if (data.data && data.data.id) {
        console.log('Pollling...');
        const check = () => {
            fetch(`https://api.apify.com/v2/actor-runs/${data.data.id}?token=${token}`)
                .then(r => r.json())
                .then(d => {
                    console.log(d.data.status);
                    if (d.data.status === 'RUNNING' || d.data.status === 'READY') {
                        setTimeout(check, 2000);
                    } else {
                        console.log('Final status:', d.data.status);
                    }
                });
        };
        check();
    }
}).catch(err => console.error(err));
