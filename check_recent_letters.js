require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data: letters, error } = await supabase
        .from('motivation_letters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) console.error(error);
    else {
        letters.forEach(l => {
            console.log(`[${l.created_at}] ID: ${l.id}, Status: ${l.generation_status}, Error: ${l.generation_error}, Company: ${l.company_name}`);
        });
    }
}
test();
