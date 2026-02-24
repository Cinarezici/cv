import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getOrCreateCompanyProfile } from './src/lib/company-research.js';

dotenv.config({ path: '.env.local' });

// Mock supabase since getOrCreateCompanyProfile uses src/lib/supabase/server
// We'll use service role for the test script
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSimulation() {
    const userId = '07835848-0d19-4806-a006-218df9b43343'; // Assuming this is the user from logs
    const companyUrl = 'https://apple.com';
    const companyName = 'Apple';

    console.log("🚀 Starting simulation for Apple...");

    try {
        const result = await getOrCreateCompanyProfile(userId, companyUrl, companyName);
        console.log("✅ Success!", result);
    } catch (err) {
        console.error("❌ Simulation failed:", err);
    }
}

runSimulation();
