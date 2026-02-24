import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFailures() {
    const { data, error } = await supabase
        .from('motivation_letters')
        .select('id, company_name, generation_status, generation_error, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("DB Error:", error);
        return;
    }

    console.log("Recent failures:");
    data.forEach(l => {
        console.log(`- [${l.created_at}] ${l.company_name}: status=${l.generation_status}, error=${l.generation_error}`);
    });
}

checkFailures();
