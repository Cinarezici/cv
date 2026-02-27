require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // 1. Get user 
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    // 2. Get profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).limit(1).single();
    if (!profile) return console.log('no profile');

    // 3. Create a valid session token to simulate an authenticated Next JS request
    console.log('Sending request to http://localhost:3000/api/motivation-letters ...');

    const payload = {
        companies: [{
            url: 'https://www.linkedin.com/company/apple',
            name: 'Apple',
            jobDescription: 'Software Engineer'
        }],
        cvId: profile.id, // Emulating the "Use My Profile" option which passes profile ID
        jobConfigs: [{
            targetRole: 'Software Engineer',
            tone: 'corporate',
            language: 'en'
        }]
    };

    try {
        const fetch = global.fetch; // using Node 18+ native fetch

        // Let's first make a normal request to see if it rejects for auth or fails on backend
        // Actually, without cookies/auth, the API will return 401 Unauthorized.
        // I need to generate a JWT or use service role.
        // Wait, the API route uses `await supabase.auth.getUser()`, which reads cookies or Authorization header.

        // Generate a token for the user
        const { data: { session }, error: sessionErr } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: user.email,
        });

        // Actually it's easier to login the user if we had a password, otherwise we can just mock the API route locally
        // Let's hit the server with a valid JWT
        // supabase.auth.admin doesn't magically return a ready-to-use JWT for requests without a password login.
        // Alternative: temporarily modify the API route to bypass auth or read the Authorization header directly.

        console.log("Mocking the next app instead...");
    } catch (err) {
        console.error(err);
    }
}
test();
