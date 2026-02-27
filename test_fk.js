require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    // Check if fk_motivation_letters_cv exists
    const { data: constraint, error } = await supabase.rpc('get_foreign_keys');
    console.log(error || 'RPC might not exist, trying direct metadata query if possible.');

    // Instead of querying metadata, let's just do a dry-run insert with an invalid UUID
    const { error: uuidErr } = await supabase.from('motivation_letters').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        cv_id: '00000000-0000-0000-0000-000000000000',
        company_name: 'test'
    });
    console.log('Error when inserting invalid UUIDs (should show constraint name):', uuidErr);
}
test();
