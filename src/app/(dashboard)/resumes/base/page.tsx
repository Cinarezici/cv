"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, AlertCircle, FileText, Briefcase, UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function BaseResumePage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const MAX_PROFILES = 4;

    const fetchProfiles = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            setProfiles(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleCreateBaseCv = async (profileId: string) => {
        setGeneratingId(profileId);
        setError(null);

        try {
            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, jobDescription: "General standard standard resume without specific targeted keywords. Make it professional." }),
            });

            if (!res.ok) {
                throw new Error('Failed to generate base resume');
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setGeneratingId(null);
        }
    };

    const handleDeleteProfile = async (profileId: string) => {
        if (!confirm('Are you sure you want to permanently delete this profile?')) return;
        setDeletingId(profileId);
        try {
            const supabase = createClient();
            const { error: deleteErr } = await supabase.from('profiles').delete().eq('id', profileId);
            if (deleteErr) throw deleteErr;

            toast.success("Profile deleted successfully.");
            await fetchProfiles();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete profile');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading profiles...</p>
                </div>
            </div>
        );
    }

    const profilesCount = profiles.length;
    const isLimitReached = profilesCount >= MAX_PROFILES;

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-4">
                    <UserCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-3">
                    Select Your Baseline Profile
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-sm md:text-base">
                    Choose one of your imported profiles to instantly generate an ATS-friendly Master CV. You can safely store up to {MAX_PROFILES} unique histories.
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 mb-8 max-w-2xl mx-auto shadow-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {profilesCount === 0 ? (
                <div className="border border-dashed border-zinc-300 dark:border-white/20 rounded-3xl p-12 text-center bg-zinc-50/50 dark:bg-[#0f1525] flex flex-col items-center justify-center max-w-2xl mx-auto hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <div className="bg-white dark:bg-white/5 p-4 rounded-full shadow-sm mb-4">
                        <FileText className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Profiles Found</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm max-w-xs">You haven't imported any profile data yet. Let's get your first base profile created.</p>
                    <Button onClick={() => router.push('/import')} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-full font-bold shadow-md hover:shadow-lg transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Import Your First Profile
                    </Button>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 relative">
                        {profiles.map(p => (
                            <div key={p.id} className="group relative flex flex-col bg-white dark:bg-[#0f1525] rounded-3xl border border-zinc-200/80 dark:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden hover:-translate-y-1">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-500/20">
                                                {p.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight">{p.full_name || 'Unknown User'}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                                                    Base Profile
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProfile(p.id)}
                                            disabled={deletingId === p.id || generatingId !== null}
                                            className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors disabled:opacity-50"
                                            title="Delete Profile"
                                        >
                                            {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-2 mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                                        <Briefcase className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                                        <p className="line-clamp-2 leading-relaxed font-medium">
                                            {p.headline || 'No specific headline provided for this profile load.'}
                                        </p>
                                    </div>
                                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-4 font-semibold uppercase tracking-widest flex items-center justify-between">
                                        <span>Imported: {new Date(p.created_at).toLocaleDateString()}</span>
                                        <span>ID: {p.id.substring(0, 6)}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-50 dark:bg-[#080d1a] border-t border-zinc-100 dark:border-white/10 mt-auto">
                                    <Button
                                        onClick={() => handleCreateBaseCv(p.id)}
                                        disabled={generatingId !== null || deletingId !== null}
                                        className="w-full bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl h-12 font-bold shadow-md transition-transform active:scale-[0.98]"
                                    >
                                        {generatingId === p.id
                                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Forging Master CV...</>
                                            : <><FileText className="w-4 h-4 mr-2" /> Select & Generate CV </>
                                        }
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Limit Card or Add New Button */}
                        {!isLimitReached && (
                            <button
                                onClick={() => router.push('/import')}
                                className="group flex flex-col items-center justify-center p-8 bg-transparent border-2 border-dashed border-zinc-300 dark:border-white/20 rounded-3xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10 transition-all text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 min-h-[280px]"
                            >
                                <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 dark:border-white/10 mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-lg mb-1">Add Another Profile</span>
                                <span className="text-sm font-medium opacity-70 px-4 text-center">
                                    You have {MAX_PROFILES - profilesCount} slot{MAX_PROFILES - profilesCount === 1 ? '' : 's'} remaining.
                                </span>
                            </button>
                        )}
                    </div>

                    {isLimitReached && (
                        <div className="mt-8 flex items-center justify-center gap-3 bg-zinc-900 text-white p-5 rounded-2xl max-w-2xl mx-auto shadow-lg">
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                            <p className="text-sm font-semibold">
                                You have reached the maximum limit of {MAX_PROFILES} profiles. Please delete an older profile to make room for a new one.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
