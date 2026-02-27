import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMotivationLetter } from '@/lib/letter-generator';
import { generateLetterPDF } from '@/lib/pdf-generator';
import { getOrCreateCompanyProfile } from '@/lib/company-research';
import crypto from 'crypto';
import { ToneType } from '@/types/motivation-letter';
import { mapToResumeJSON } from '@/lib/resume-mapper';

// POST /api/motivation-letters/[id]/retry
// Re-runs the full generation pipeline for a failed letter
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Fetch the existing letter to get company/config data
        const { data: letter } = await supabase
            .from('motivation_letters')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (!letter) return NextResponse.json({ error: 'Letter not found' }, { status: 404 });

        // Check plan
        const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
        const isPro = ['active', 'trialing'].includes(sub?.status as string);

        // Fetch CV / profile data
        let resumeJSON: any = null;
        if (letter.cv_id) {
            const { data: cv } = await supabase
                .from('resumes').select('*').eq('id', letter.cv_id).eq('user_id', user.id).single();
            if (cv) resumeJSON = cv.optimized_json;
        }
        if (!resumeJSON) {
            // Fall back to first profile
            const { data: profiles } = await supabase
                .from('profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
            if (profiles && profiles[0]) {
                // Use raw_json + mapper — same contract used everywhere else in this codebase
                resumeJSON = mapToResumeJSON(profiles[0].raw_json);
            }
        }
        if (!resumeJSON) {
            return NextResponse.json({ error: 'CV bulunamadı' }, { status: 404 });
        }

        // Reset status to pending so the frontend polls
        await supabase.from('motivation_letters').update({
            generation_status: 'pending',
            generation_error: null,
        }).eq('id', id);

        // Kick off async generation — fire and forget
        const company = {
            url: letter.company_url || '',
            name: letter.company_name,
            jobDescription: letter.job_description || undefined,
        };
        const config = {
            targetRole: letter.job_title || '',
            tone: (letter.tone || 'corporate') as ToneType,
            language: (letter.language || 'en') as 'en' | 'tr',
        };

        retryLetterGeneration(id, company, config, resumeJSON, user.id, isPro);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Retry error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// ──────────────────────────────────────────────
// Async generation pipeline (same as main route)
// ──────────────────────────────────────────────
async function retryLetterGeneration(
    letterId: string,
    company: { url: string; name: string; jobDescription?: string },
    config: { targetRole: string; tone: ToneType; language: 'en' | 'tr' },
    resumeJSON: any,
    userId: string,
    isPro: boolean,
) {
    const supabase = await createClient();

    const updateStatus = async (status: string, message?: string) => {
        await supabase.from('motivation_letters').update({
            generation_status: status,
            generation_error: message ?? null,
        }).eq('id', letterId);
    };

    try {
        await updateStatus('researching');

        // Build a safe company URL — if empty, derive from name
        let safeUrl = company.url;
        if (!safeUrl || safeUrl.trim() === '') {
            const slug = company.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            safeUrl = `https://www.${slug}.com`;
        }

        let companyProfile: any;
        let companyProfileId: string = '';
        try {
            const result = await getOrCreateCompanyProfile(userId, safeUrl, company.name);
            companyProfile = result.profile;
            companyProfileId = result.companyProfileId;
        } catch {
            // Fallback: build a minimal profile from the company name
            companyProfile = {
                name: company.name,
                website: safeUrl,
                industry: 'Unknown',
                values: [],
                products: [],
                recentNews: [],
                cultureIndicators: [],
                dataQualityScore: 5,
                scrapedPages: [],
                scrapedAt: new Date().toISOString(),
            };
        }

        if (companyProfileId) {
            await supabase.from('motivation_letters').update({ company_profile_id: companyProfileId }).eq('id', letterId);
        }

        await updateStatus('generating');
        const { letterText, letterHtml } = await generateMotivationLetter(
            companyProfile, resumeJSON, config.targetRole, config.tone, config.language, company.jobDescription,
        );

        await updateStatus('creating_pdf');
        const { pdfUrl, pdfStoragePath } = await generateLetterPDF(
            letterText, resumeJSON, company.name, config.targetRole, 'modern', userId, letterId, isPro
        );

        const shareToken = crypto.randomUUID();
        const shareExpiry = !isPro ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;

        await supabase.from('motivation_letters').update({
            content: letterText,
            letter_html: letterHtml,
            pdf_url: pdfUrl,
            pdf_storage_path: pdfStoragePath,
            pdf_filename: `Presentation_${company.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            pdf_template_id: 'modern',
            pdf_generated_at: new Date().toISOString(),
            share_token: shareToken,
            share_expires_at: shareExpiry,
            generation_status: 'completed',
            generation_error: null,
        }).eq('id', letterId);

    } catch (err: any) {
        console.error(`Retry generation failed for ${letterId}:`, err);
        await updateStatus('failed', err.message);
    }
}
