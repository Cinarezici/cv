require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];

    // Test inserting the letter with null cv_id
    const { data: letter, error: insertError } = await supabase.from('motivation_letters').insert({
        user_id: user.id,
        cv_id: null,
        company_name: 'Test Test Test',
        job_title: 'Software Engineer',
        tone: 'startup',
        content: '',
        letter_html: '',
        generation_status: 'pending',
        batch_id: 'test'
    }).select().single();

    if (insertError) {
        console.error("Null cv_id failed:", insertError);
    } else {
        console.log("Null cv_id success!", letter.id);
        await supabase.from('motivation_letters').delete().eq('id', letter.id);
    }
}
test();
