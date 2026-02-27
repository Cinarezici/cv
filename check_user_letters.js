require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data: users, error: err } = await supabase.auth.admin.listUsers();
    if (err) return console.error(err);
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    const { data: letters, error } = await supabase.from('motivation_letters').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
    if (error) {
        console.error('Error fetching letters:', error);
    } else {
        console.log('Recent letters for user:', user.email);
        console.log(letters.map(l => ({ id: l.id, status: l.generation_status, time: l.created_at, company: l.company_name })));
    }
}
test();
