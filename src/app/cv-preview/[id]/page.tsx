/**
 * /cv-preview/[id]  — lightweight standalone CV preview page
 * Used inside an iframe by CvPreviewModal. No navigation chrome.
 * Fetches the resume row, hydrates the Zustand store client-side,
 * and renders CVRenderer in isolation.
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CvPreviewClient from './CvPreviewClient';

export const dynamic = 'force-dynamic';

export default async function CvPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: resume } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!resume) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-zinc-400 text-sm font-medium">
                CV not found.
            </div>
        );
    }

    return <CvPreviewClient resume={resume} />;
}
