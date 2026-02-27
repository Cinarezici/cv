require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // Get valid user
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    // Get valid profile/cv
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).limit(1).single();
    if (!profile) return console.log('No profile');

    // Create a fake HTTP request to the handler
    // We can just invoke POST from the file using Next.js Request simulation, but fetching locally via curl is easier if the server is running.
    // Instead of launching a whole server, let's just require the route handler locally if possible, OR just simulate the supabase fetch that is failing.

    // The issue might be process.env.OPENAI_API_KEY when running locally vs Vercel? No, Vercel has OPENAI_API_KEY.
    console.log('Got profile:', profile.id);
}
test();
