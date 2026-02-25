/**
 * /api/cv-share — Authenticated API for managing CV share links.
 *
 * POST   → Create (or re-enable) a share link for a resume by the authenticated user.
 * DELETE → Disable a share link so it no longer grants access.
 *
 * Never exposes subscription data. All subscription checks happen in resolveShareAccess().
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createShareLink, disableShareLink } from '@/lib/cv-share';

// ── POST /api/cv-share ─────────────────────────────────────────────────────
// Body: { resumeId: string }
// Returns: { shareId: string, shareUrl: string }

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { resumeId?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { resumeId } = body;
    if (!resumeId) {
        return NextResponse.json({ error: 'resumeId is required' }, { status: 400 });
    }

    // Verify the resume belongs to this user (row-level check via anon client)
    const { data: resume, error: resumeErr } = await supabase
        .from('resumes')
        .select('id, user_id')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single();

    if (resumeErr || !resume) {
        return NextResponse.json({ error: 'Resume not found or access denied' }, { status: 404 });
    }

    try {
        const { shareId, shareUrl } = await createShareLink(resumeId, user.id);

        // Fetch subscription to check isPro
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        const isPro = sub?.is_pro === true || sub?.status === 'active' || sub?.plan === 'lifetime';

        // We assume a newly created link is enabled and its createdAt is roughly now
        return NextResponse.json({
            shareId,
            shareUrl,
            isPro,
            isEnabled: true,
            createdAt: new Date().toISOString()
        }, { status: 201 });
    } catch (err: any) {
        console.error('[cv-share POST]', err);
        return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
    }
}

// ── DELETE /api/cv-share?id=<shareId> ─────────────────────────────────────
// Disables the share link so public requests are denied.

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shareId = req.nextUrl.searchParams.get('id');
    if (!shareId) {
        return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    try {
        await disableShareLink(shareId, user.id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[cv-share DELETE]', err);
        return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
    }
}

// ── GET /api/cv-share?resumeId=<id> ───────────────────────────────────────
// Returns the active share link for a resume if one exists.

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumeId = req.nextUrl.searchParams.get('resumeId');
    if (!resumeId) {
        return NextResponse.json({ error: 'resumeId query param is required' }, { status: 400 });
    }

    const { data: link } = await supabase
        .from('cv_share_links')
        .select('id, is_enabled, created_at')
        .eq('resume_id', resumeId)
        .eq('owner_user_id', user.id)
        .maybeSingle();

    if (!link) {
        return NextResponse.json({ shareLink: null });
    }

    // Fetch subscription to check isPro
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    const isPro = sub?.is_pro === true || sub?.status === 'active' || sub?.plan === 'lifetime';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cvoptimizerai.com';
    return NextResponse.json({
        shareLink: {
            shareId: link.id,
            shareUrl: `${baseUrl}/cv/${link.id}`,
            createdAt: link.created_at,
            isEnabled: link.is_enabled,
            isPro,
        },
    });
}
