require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // get user
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    // get profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).limit(1).single();
    if (!profile) return console.log('no profile');

    // try to insert
    const { data, error } = await supabase.from('motivation_letters').insert({
        user_id: user.id,
        cv_id: profile.id, // using profile ID!
        company_name: 'Test Company',
        job_title: 'Software Engineer',
        tone: 'corporate',
        content: '',
        letter_html: '',
        generation_status: 'pending',
        batch_id: '1234'
    }).select();

    if (error) {
        console.error('Insert error:', error);
    } else {
        console.log('Insert successful:', data[0].id);
        await supabase.from('motivation_letters').delete().eq('id', data[0].id);
    }
}
test();
