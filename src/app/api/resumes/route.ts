import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsage, incrementUsage } from '@/lib/usage-enforcement';
import crypto from 'crypto';

const DEFAULT_CV_JSON = {
    header: {
        full_name: 'Your Name',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
        core: [],
        tools: [],
    },
};

// POST — Create a blank/new CV and return its ID
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

        // Read optional body for profile_id / initial overrides
        let body: any = {};
        try { body = await request.json(); } catch { /* no body is fine */ }

        const { data: resume, error } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                profile_id: body.profile_id ?? null,
                job_title: body.job_title ?? 'New CV',
                public_link_slug: crypto.randomUUID(),
                optimized_json: body.optimized_json ?? DEFAULT_CV_JSON,
                theme_id: 'clean-ats',
                theme_category: 'standard',
                color_palette_id: 'default',
                section_order: ['summary', 'experience', 'education', 'skills'],
                hidden_sections: [],
                is_active: true,
            })
            .select('id')
            .single();

        if (error) throw error;

        // Increment usage atomically
        if (usageCheck.periodStart) {
            await incrementUsage(user.id, 'cv_generation', usageCheck.periodStart);
        }

        return NextResponse.json({ id: resume.id }, { status: 201 });
    } catch (error: any) {
        console.error('Create resume error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create resume' }, { status: 500 });
    }
}
