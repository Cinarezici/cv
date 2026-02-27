require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data: users } = await supabase.auth.admin.listUsers();
    if (users.users.length === 0) return console.log('No users found');
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    // Get a profile (cvId)
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).limit(1).single();
    if (!profile) return console.log('No profile found');

    console.log('Testing insert with profile ID:', profile.id);

    const { data, error } = await supabase.from('motivation_letters').insert({
        user_id: user.id,
        cv_id: profile.id, // Trying to insert with a profile ID instead of resume ID
        company_name: 'Test',
        job_title: 'Test',
        tone: 'corporate',
        content: '',
        letter_html: '',
        generation_status: 'pending',
        batch_id: '1234'
    }).select();

    if (error) {
        console.error('Constraint error detected:', error);
    } else {
        console.log('Insert successful, no constraint error.');
        // Clean up
        await supabase.from('motivation_letters').delete().eq('id', data[0].id);
    }
}
test();
