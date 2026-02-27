require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { mapToResumeJSON } = require('./src/lib/resume-mapper.ts'); // Typescript file might need ts-node ...
// Actually let's just write the DB query logic directly
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === 'cinarezici@gmail.com') || users.users[0];
    const userId = user.id;

    // Simulate /api/my-cvs logic
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, name, created_at').eq('user_id', userId).order('created_at', { ascending: false });
    const { data: resumes, error: rErr } = await supabase.from('resumes').select('id, file_name, created_at, profile_id').eq('user_id', userId).order('created_at', { ascending: false });

    console.log("Profiles:", profiles.map(p => p.id));
    console.log("Resumes:", resumes.map(r => r.id));

    // Simulate Letter Creation with the first profile
    const cvId = profiles[0] ? profiles[0].id : (resumes[0] ? resumes[0].id : null);
    if (!cvId) return console.log('No CV ID found');

    console.log('Testing with cvId:', cvId);

    // 1. Fetch CV Data
    let resumeJSON = null;
    const { data: cv } = await supabase.from('resumes').select('*').eq('id', cvId).eq('user_id', userId).single();
    if (cv) {
        resumeJSON = cv.optimized_json;
        console.log('Using Resume');
    } else {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', cvId).eq('user_id', userId).single();
        if (profile) {
            resumeJSON = profile.raw_json;
            console.log('Using Profile');
        }
    }

    if (!resumeJSON) {
        console.log('Error: CV bulunamadı');
        return;
    }

    console.log("-> Checking usage limits...");
    // Let's just manually query the db to check limits since we can't easily import the ts module
    const { count } = await supabase.from('usage_logs').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('action_type', 'create_letter').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    console.log("Usages in 30 days:", count);

    // Test inserting the letter
    const { data: letter, error: insertError } = await supabase.from('motivation_letters').insert({
        user_id: userId,
        cv_id: cvId,
        company_name: 'Test',
        job_title: 'Test',
        tone: 'corporate',
        content: '',
        letter_html: '',
        generation_status: 'pending',
        batch_id: '123'
    }).select().single();

    if (insertError) {
        console.error("-> DB insert failed:", insertError.message);
    } else {
        console.log("-> Inserted letter mapping", letter.id);
        await supabase.from('motivation_letters').delete().eq('id', letter.id);
    }
}
test();
