import { createClient } from './src/lib/supabase/server';

async function verify() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("No active user found. Please log in in the browser first.");
            return;
        }

        console.log("Found user:", user.email, "ID:", user.id);

        const testData = {
            user_id: user.id,
            full_name: "Verification Test Profile",
            headline: "Software Engineer - Automated Test",
            raw_json: {
                name: "Verification Test Profile",
                experience: [],
                skills: ["Verification", "Automation"]
            },
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('profiles')
            .insert(testData)
            .select()
            .single();

        if (error) {
            console.error("Error inserting test profile:", error);
        } else {
            console.log("Successfully inserted test profile:", data.id);
            console.log("Now check the dashboard in the browser!");
        }
    } catch (err) {
        console.error("Script error:", err);
    }
}

verify();
