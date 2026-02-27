require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // Just insert with NO cv_id but provide a profile UUID if there is a profile_id col, or just leave it null.
    // Wait, let's just do a select without columns to see what columns exist.
    const { data, error } = await supabase.from('motivation_letters').select('*').limit(1);
    if (data) {
        console.log("Columns:", Object.keys(data[0] || {}).join(', '));
    } else {
        console.error(error);
    }
}
test();
