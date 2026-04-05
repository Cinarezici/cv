import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { checkUsage, incrementUsage } from '@/lib/usage-enforcement';

export const dynamic = 'force-dynamic';

const DEFAULT_CV_JSON = {
    header: {
        full_name: 'Your Full Name',
        email: '(your.email@example.com)',
        phone: '(+1 123 456 7890)',
        location: '(City, Country)',
        linkedin: '',
        github: '',
        website: '',
    },
    summary: 'Briefly describe your professional background, top achievements, and what you are looking for in your next role (e.g., "5+ years experience in Software Engineering with a focus on React...").',
    experience: [],
    education: [],
    skills: {
        core: [],
        tools: [],
    },
};

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json().catch(() => ({}));
        const { profileId } = body;

        // --- CHECK LIMITS BEFORE CREATING CV ---
        const usageCheck = await checkUsage(user.id, 'cv_generation');
        if (!usageCheck.allowed) {
            return NextResponse.json({ 
                error: usageCheck.reason === 'limit_exceeded' 
                    ? 'CV creation limit reached for your current plan. Please upgrade to create more.'
                    : 'A subscription is required to use this feature.', 
                code: 'LIMIT_REACHED' 
            }, { status: 403 });
        }

        // Fetch specified profile or skip if none provided (to ensure "Blank" is truly blank)
        let initialJson = { ...DEFAULT_CV_JSON };
        let profileIdToLink = null;

        if (profileId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, raw_json')
                .eq('id', profileId)
                .eq('user_id', user.id)
                .single();

            if (profile) {
                profileIdToLink = profile.id;
                const raw = profile.raw_json as any;
                initialJson = {
                    ...DEFAULT_CV_JSON,
                    header: {
                        full_name: raw?.full_name || raw?.name || DEFAULT_CV_JSON.header.full_name,
                        email: raw?.email || '',
                        phone: raw?.phone || '',
                        location: raw?.location || raw?.country || '',
                        linkedin: raw?.linkedin_url || raw?.linkedin || '',
                        github: raw?.github || '',
                        website: raw?.website || '',
                    },
                    summary: raw?.summary || '',
                    experience: raw?.experience || raw?.experiences || [],
                    education: raw?.education || [],
                    skills: {
                        core: raw?.skills || raw?.skills_list || [],
                        tools: [],
                    },
                };
            }
        }

        // Create a fresh resume record
        // NOTE: profile_id is intentionally omitted when null so we don't
        // violate a NOT NULL constraint in the resumes table. If the column
        // is nullable, it will be stored as NULL; if it is NOT NULL in the DB,
        // we must NOT pass null — we simply leave it up to the DB default.
        const insertPayload: Record<string, any> = {
            user_id: user.id,
            job_title: 'New CV',
            public_link_slug: crypto.randomUUID(),
            optimized_json: initialJson,
            theme_id: 'clean-ats',
            theme_category: 'standard',
            color_palette_id: 'default',
            section_order: ['summary', 'experience', 'education', 'skills'],
            hidden_sections: [],
            is_active: true,
            updated_at: new Date().toISOString(),
        };

        if (profileIdToLink) {
            insertPayload.profile_id = profileIdToLink;
        }

        const { data: resume, error } = await supabase
            .from('resumes')
            .insert(insertPayload)
            .select('id')
            .single();

        if (error) throw error;

        // Increment usage atomically
        if (usageCheck.periodStart) {
            await incrementUsage(user.id, 'cv_generation', usageCheck.periodStart);
        }

        return NextResponse.json({ id: resume.id });
    } catch (error: any) {
        console.error('Failed to create blank CV:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
