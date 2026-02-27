/**
 * /builder/[id] — CV Builder page (server component)
 *
 * Authenticated owner-only view. Fetches the resume by ID and passes
 * the full row + subscription tier to BuilderClient.
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuilderClient from './BuilderClient';
import { X, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BuilderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth guard
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    // Fetch resume — owner check via RLS + eq user_id
    const { data: resume } = await supabase
        .from('resumes')
        .select('*, profiles(raw_json)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!resume) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
                <div className="max-w-md text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <X className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900">CV Not Found</h2>
                    <p className="text-zinc-600">The CV you are looking for doesn't exist or you don't have permission to view it.</p>
                    <a href="/dashboard" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // Check subscription status
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    const isPro = ['active'].includes(sub?.status as string);

    // Extract avatar from joined profile
    let avatarUrl: string | null = null;
    const profilesArr = resume.profiles as any;
    if (profilesArr) {
        const prof = Array.isArray(profilesArr) ? profilesArr[0] : profilesArr;
        avatarUrl = prof?.raw_json?.avatar_base64 ?? null;
    }

    return <BuilderClient data={resume} avatarUrl={avatarUrl} isPro={isPro} />;
}
