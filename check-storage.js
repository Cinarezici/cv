import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStorage() {
    console.log("Checking Supabase Storage Buckets...");
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error listing buckets:", error);
        return;
    }

    console.log("Available buckets:", buckets.map(b => b.name).join(', '));

    const targetBucket = 'user-files';
    const exists = buckets.find(b => b.name === targetBucket);

    if (!exists) {
        console.log(`⚠️ Bucket '${targetBucket}' DOES NOT EXIST.`);
        // Try to create it if it's missing
        console.log(`Attempting to create '${targetBucket}' bucket...`);
        const { error: createError } = await supabase.storage.createBucket(targetBucket, {
            public: false
        });
        if (createError) {
            console.error("Failed to create bucket:", createError);
        } else {
            console.log(`✅ Bucket '${targetBucket}' created successfully.`);
        }
    } else {
        console.log(`✅ Bucket '${targetBucket}' exists.`);
    }
}

checkStorage();
