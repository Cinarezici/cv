import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No active user found. Please log in first." }, { status: 401 });
        }

        const testData = {
            user_id: user.id,
            full_name: "Verification Test Profile - " + new Date().toLocaleTimeString(),
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
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully inserted test profile",
            profileId: data.id,
            user: user.email
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
