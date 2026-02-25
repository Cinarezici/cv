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

    if (!result.allowed) {
        if (result.reason === 'not_found') {
            return (
                <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/5 p-8 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Link Not Found</h2>
                        <p className="text-gray-500 mb-6">This shared CV link is invalid or no longer exists.</p>
                        <a href={HOME_URL} className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors">
                            Return Home
                        </a>
                    </div>
                </div>
            );
        }

        if (result.reason === 'disabled') {
            return (
                <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/5 p-8 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Link Disabled</h2>
                        <p className="text-gray-500 mb-6">The owner of this CV has disabled public sharing.</p>
                        <a href={HOME_URL} className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors">
                            Return Home
                        </a>
                    </div>
                </div>
            );
        }

        if (result.reason === 'expired') {
            return (
                <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/5 p-8 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">This shared CV link has expired</h2>
                        <p className="text-gray-500 mb-6">Free access lasts 14 days. The owner needs to upgrade to keep this link active.</p>
                        <div className="flex flex-col gap-3">
                            <a href={`${HOME_URL}/upgrade`} className="inline-flex items-center justify-center px-4 py-3 bg-black text-white rounded-[12px] font-medium hover:bg-black/90 transition-colors">
                                Upgrade to Lifetime ($99 one-time)
                            </a>
                            <a href={HOME_URL} className="inline-flex items-center justify-center px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-[12px] font-medium hover:bg-gray-50 transition-colors">
                                Return home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback
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
