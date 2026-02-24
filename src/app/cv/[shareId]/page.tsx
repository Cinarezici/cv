/**
 * /cv/[shareId] — Protected public CV share page.
 *
 * Server component: resolves share access server-side, checks subscription,
 * then either redirects home (access denied) or renders the CV.
 *
 * SECURITY:
 *  - All checks run server-side with the service-role key
 *  - Subscription data is NEVER sent to the client
 *  - Client only receives sanitised CV content (full resumes row minus sensitive cols)
 */

import { redirect } from 'next/navigation';
import { resolveShareAccess } from '@/lib/cv-share';
import CvShareViewer from './CvShareViewer';

export const dynamic = 'force-dynamic'; // Re-check sub on every visit
export const revalidate = 0;

const HOME_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cvoptimizerai.com';

export default async function CvSharePage({
    params,
}: {
    params: Promise<{ shareId: string }>;
}) {
    const { shareId } = await params;

    if (!shareId) redirect(HOME_URL);

    const result = await resolveShareAccess(shareId);

    // ── Access denied — always redirect, NEVER expose why ─────────────────────
    if (!result.allowed) {
        redirect(HOME_URL);
    }

    const { resume } = result;

    // If a pre-generated PDF URL exists, redirect directly to it
    if (resume?.pdf_url) {
        redirect(resume.pdf_url);
    }

    // Extract avatar from joined profiles if any
    let avatarUrl: string | null = null;
    if (resume?.profiles) {
        const p = Array.isArray(resume.profiles) ? resume.profiles[0] : resume.profiles;
        avatarUrl = p?.raw_json?.avatar_base64 ?? null;
    }

    // Pass the full resume row to CvShareViewer (same pattern as /r/[slug])
    return <CvShareViewer data={resume} initialAvatarUrl={avatarUrl} />;
}
