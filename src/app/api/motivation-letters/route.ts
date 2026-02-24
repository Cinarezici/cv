import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateCompanyProfile } from '@/lib/company-research';
import { generateMotivationLetter } from '@/lib/letter-generator';
import { generateLetterPDF } from '@/lib/pdf-generator';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { ToneType } from '@/types/motivation-letter';

interface JobConfig {
    targetRole: string;
    tone: ToneType;
    language: 'en' | 'tr';
}

interface CompanyInput {
    url: string;
    name: string;
    jobDescription?: string;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        let query = supabase
            .from('motivation_letters')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('company_name', `%${search}%`);
        }

        const { data: letters, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json(letters);
    } catch (error: any) {
        console.error('List motivation letters error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch motivation letters' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    console.log("POST /api/motivation-letters reached");
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { companies, cvId, jobConfigs } = await request.json() as {
            companies: CompanyInput[];
            cvId: string;
            jobConfigs: JobConfig[]
        };

        // 1. Fetch CV Data — try resumes first, then profiles (LinkedIn imports)
        let resumeJSON: any = null;
        const { data: cv } = await supabase.from('resumes').select('*').eq('id', cvId).eq('user_id', user.id).single();
        if (cv) {
            resumeJSON = cv.optimized_json;
        } else {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', cvId).eq('user_id', user.id).single();
            if (profile) {
                // Normalize profile fields to match resumeJSON shape
                resumeJSON = {
                    name: profile.full_name,
                    headline: profile.headline,
                    summary: profile.summary || profile.about,
                    skills: profile.skills || [],
                    experience: profile.experiences || profile.work_experience || [],
                    email: profile.email,
                    phone: profile.phone,
                    location: profile.location,
                };
            }
        }
        if (!resumeJSON) {
            return NextResponse.json({ error: 'CV bulunamadı' }, { status: 404 });
        }

        // 2. Check Plan & Limits
        const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
        // A simple check for Pro plan to allow batching
        const isPro = sub?.status === 'active';

        if (!isPro && companies.length > 1) {
            return NextResponse.json({ error: 'upgrade_required', message: 'Toplu mektup oluşturma sadece Pro planda geçerlidir.' }, { status: 403 });
        }

        const { checkUsageLimits } = await import('@/lib/limits');
        const { allowed, reason } = await checkUsageLimits(user.id, 'create_letter');

        // If not allowed and they are trying to insert, reject.
        // Wait, if companies length + current letters > limit, we should ideally block before reaching the limit, but this checks if currently AT limit.
        if (!allowed) {
            return NextResponse.json({ error: 'limit_reached', message: reason }, { status: 403 });
        }

        const batchId = crypto.randomUUID();
        const createdLetters: any[] = [];

        for (let i = 0; i < companies.length; i++) {
            const company = companies[i];
            const config = jobConfigs[i];

            const insertResult = await supabase.from('motivation_letters').insert({
                user_id: user.id,
                cv_id: null,               // FK references 'cvs' table — keep null, resumeJSON passed directly
                company_name: company.name || 'Unknown',
                job_title: config.targetRole || '',
                tone: config.tone || 'corporate',
                content: '',
                letter_html: '',
                generation_status: 'pending',
                batch_id: batchId,
            }).select().single();

            if (insertResult.error) {
                console.error("Failed to insert motivation letter:", JSON.stringify(insertResult.error));
                return NextResponse.json({ error: 'DB insert failed: ' + insertResult.error.message }, { status: 500 });
            }

            const letter = insertResult.data;
            if (letter) {
                createdLetters.push(letter);
                // Pass company_url, language, jobDescription separately — not stored in DB yet
                processLetterGeneration(
                    letter.id,
                    { ...company, url: company.url || '' },
                    { ...config, language: config.language || 'en' },
                    resumeJSON,
                    user.id,
                    isPro
                );
            }
        }

        return NextResponse.json({ letters: createdLetters, batchId });

    } catch (error: any) {
        console.error("Create letter API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function processLetterGeneration(
    letterId: string,
    company: CompanyInput,
    config: JobConfig,
    resumeJSON: any,
    userId: string,
    isPro: boolean
) {
    const supabase = await createClient();

    async function updateStatus(status: string, message?: string) {
        await supabase.from('motivation_letters').update({
            generation_status: status,
            generation_error: message,
        }).eq('id', letterId);
    }

    try {
        await updateStatus('researching', 'Web sitesi araştırılıyor...');

        // Ensure a valid URL before calling Apify
        let safeUrl = company.url;
        if (!safeUrl || safeUrl.trim() === '') {
            const slug = company.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            safeUrl = `https://www.${slug}.com`;
        }

        let companyProfile: any;
        let companyProfileId = '';
        try {
            const result = await getOrCreateCompanyProfile(userId, safeUrl, company.name);
            companyProfile = result.profile;
            companyProfileId = result.companyProfileId;
            if (companyProfileId) {
                await supabase.from('motivation_letters').update({ company_profile_id: companyProfileId }).eq('id', letterId);
            }
        } catch {
            companyProfile = {
                name: company.name, website: safeUrl, industry: 'Unknown',
                values: [], products: [], recentNews: [], cultureIndicators: [],
                dataQualityScore: 5, scrapedPages: [], scrapedAt: new Date().toISOString(),
            };
        }

        let finalJobDescription = company.jobDescription;
        let finalTargetRole = config.targetRole;

        if (!finalJobDescription && company.url && company.url.includes('linkedin.com/jobs')) {
            try {
                await updateStatus('researching', 'LinkedIn ilanı analiz ediliyor...');
                const res = await fetch(company.url, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
                if (res.ok) {
                    const html = await res.text();
                    const $ = cheerio.load(html);
                    const title = $('h1').first().text().trim();
                    const description = $('.show-more-less-html__markup').text().trim() || $('.description__text').text().trim();
                    if (title && !finalTargetRole) finalTargetRole = title;
                    if (description) finalJobDescription = description;
                }
            } catch (err) {
                console.error("Failed to scrape linkedin job directly", err);
            }
        }

        await updateStatus('generating', 'Mektup yazılıyor...');
        const { letterText, letterHtml } = await generateMotivationLetter(
            companyProfile, resumeJSON, finalTargetRole, config.tone, config.language, finalJobDescription
        );

        await updateStatus('creating_pdf', 'PDF oluşturuluyor...');
        const templateId = 'modern';
        const { pdfUrl, pdfStoragePath } = await generateLetterPDF(
            letterText, resumeJSON, company.name, config.targetRole, templateId, userId, letterId, isPro
        );

        const shareToken = crypto.randomUUID();
        const shareExpiry = !isPro ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;

        await supabase.from('motivation_letters').update({
            content: letterText,
            letter_html: letterHtml,
            pdf_url: pdfUrl,
            pdf_storage_path: pdfStoragePath,
            pdf_filename: `Motivation_Letter_${company.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            pdf_template_id: templateId,
            pdf_generated_at: new Date().toISOString(),
            share_token: shareToken,
            share_expires_at: shareExpiry,
            generation_status: 'completed',
            generation_error: null,
        }).eq('id', letterId);

    } catch (err: any) {
        console.error(`Letter generation failed for ${letterId}:`, err);
        await updateStatus('failed', err.message);
    }
}
