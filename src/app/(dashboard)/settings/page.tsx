"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, CreditCard, AlertTriangle, Trash2, LogOut, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LIMITS } from '@/lib/limits-config';
import { format, addDays } from 'date-fns';
import { useLang, type Lang } from '@/lib/i18n';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { lang, setLang, t } = useLang();

    // Auth state
    const [email, setEmail] = useState('');
    const [subscription, setSubscription] = useState<any>(null);
    const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0);
    const [nextResetDate, setNextResetDate] = useState<Date>(new Date());

    // Usage State
    const [cvCount, setCvCount] = useState(0);
    const [letterCount, setLetterCount] = useState(0);
    const [searchCount, setSearchCount] = useState(0);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                const supabase = createClient();
                const { data: { user }, error: authErr } = await supabase.auth.getUser();
                if (authErr || !user) {
                    router.push('/login');
                    return;
                }

                setEmail(user.email || 'No email associated');

                // Fetch subscription
                const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
                if (sub) setSubscription(sub);

                // Calculate Trial / Reset Dates from subscription row (prefer trial_end_at)
                const rawEnd = sub?.trial_end_at ?? sub?.trial_ends_at;
                if (rawEnd) {
                    const _trialEndDate = new Date(rawEnd);
                    const diffDays = Math.ceil((_trialEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    setTrialDaysLeft(diffDays > 0 ? diffDays : 0);
                    setNextResetDate(_trialEndDate);
                } else {
                    // Fallback: 14 days from account creation
                    const creationDate = new Date(user.created_at || new Date());
                    const _trialEndDate = new Date(creationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                    const diffDays = Math.ceil((_trialEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    setTrialDaysLeft(diffDays > 0 ? diffDays : 0);
                    setNextResetDate(_trialEndDate);
                }

                // Fetch Usage Stats
                const { count: cvs } = await supabase.from('resumes').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                setCvCount(cvs || 0);

                const { count: letters } = await supabase.from('motivation_letters').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                setLetterCount(letters || 0);

                let startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const { count: searches } = await supabase.from('scout_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfDay.toISOString());
                setSearchCount(searches || 0);

            } catch (err: any) {
                console.error(err);
                setError("Failed to load settings data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettingsData();
    }, []);

    const handleSignOut = async () => {
        try {
            setLogoutLoading(true);
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/login');
            router.refresh();
        } catch (err) {
            console.error('Error signing out:', err);
        } finally {
            setLogoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-500" />
            </div>
        );
    }

    const rawEnd = subscription?.trial_end_at ?? subscription?.trial_ends_at;
    const isPro = ['active'].includes(subscription?.status as string);
    const isCanceled = !isPro && rawEnd ? new Date() > new Date(rawEnd) : subscription?.status === 'canceled';

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 bg-[#fafafa] dark:bg-zinc-950 min-h-[calc(100vh-100px)] text-zinc-900 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-white">{t.settingsTitle}</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px]">Manage your account and billing preferences.</p>
            </div>

            {error && <div className="mb-6 text-sm font-medium text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">{error}</div>}

            <div className="space-y-6">

                {/* Language Selector */}
                <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="h-[18px] w-[18px] text-zinc-800 dark:text-zinc-200" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">{t.languageSettingLabel}</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-5 font-medium">{t.languageSettingDesc}</p>
                        <div className="flex gap-3">
                            {(['en', 'tr'] as Lang[]).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all ${lang === l
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                                        : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-xl">{l === 'en' ? '🇬🇧' : '🇹🇷'}</span>
                                    <span>{l === 'en' ? t.english : t.turkish}</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="h-[18px] w-[18px] text-zinc-800 dark:text-zinc-200" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">Account Information</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Your personal account details.</p>

                        <div className="space-y-2 max-w-full">
                            <label className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-300">Email</label>
                            <Input
                                value={email}
                                disabled
                                className="h-11 bg-zinc-50 dark:bg-white/5 border-none text-zinc-900 dark:text-white cursor-not-allowed text-[14px] rounded-lg w-full"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Plan & Limits */}
                <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="h-[18px] w-[18px] text-zinc-800 dark:text-zinc-200" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">Plan & Limits</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Manage your plan and view usage limits.</p>

                        <div className="border border-zinc-200 dark:border-white/10 rounded-xl p-5 mb-4 bg-[#fcfcfc] dark:bg-white/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h3 className="text-[18px] font-bold text-zinc-900 dark:text-white">
                                            {isPro ? 'Pro Plan' : isCanceled ? 'Free Plan — Expired' : 'Free Plan'}
                                        </h3>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${isPro ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'
                                                : isCanceled ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                                            }`}>
                                            {isPro ? 'ACTIVE' : isCanceled ? 'LOCKED' : 'LIMITED'}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-zinc-500 dark:text-zinc-400 font-medium mb-3">
                                        {isPro ? 'Enjoy unlimited access to all features.'
                                            : isCanceled ? 'Your trial ended. Upgrade to regain full access.'
                                                : 'Your free limits reset every 14 days.'}
                                    </p>

                                    {!isPro && !isCanceled && (
                                        <div className="inline-flex items-center bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-100 dark:border-orange-500/20">
                                            <span className="text-[13px] font-semibold text-orange-600 dark:text-orange-400">
                                                Next Reset: {format(nextResetDate, 'M/d/yyyy')} ({trialDaysLeft} days left)
                                            </span>
                                        </div>
                                    )}
                                    {isCanceled && (
                                        <div className="inline-flex items-center bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md border border-red-100 dark:border-red-500/20">
                                            <span className="text-[13px] font-semibold text-red-600 dark:text-red-400">
                                                Locked — Upgrade to continue
                                            </span>
                                        </div>
                                    )}
                                    {isPro && (
                                        <div className="inline-flex items-center bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-100 dark:border-indigo-500/20">
                                            <span className="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                Status: Lifetime Access
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {!isPro && (
                                    <Button
                                        onClick={() => window.location.href = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL!}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 h-10 rounded-lg shadow-sm w-full sm:w-auto"
                                    >
                                        {isCanceled ? 'Upgrade to Pro — $99' : 'Upgrade to Pro'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UsageWidget
                                title="CV PROJECTS"
                                current={cvCount}
                                max={LIMITS.MAX_CVS_FREE}
                                barColor="bg-[#2563eb]" // Blue
                                isPro={isPro}
                            />
                            <UsageWidget
                                title="COVER LETTERS"
                                current={letterCount}
                                max={LIMITS.MAX_LETTERS_FREE}
                                barColor="bg-[#9333ea]" // Purple
                                isPro={isPro}
                            />
                            <UsageWidget
                                title="DAILY SEARCHES"
                                current={searchCount}
                                max={LIMITS.MAX_JOB_SEARCHES_DAILY}
                                barColor="bg-[#16a34a]" // Green
                                isPro={isPro}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Logout Section */}
                <Card className="border border-zinc-200 dark:border-white/10 shadow-sm rounded-xl bg-white dark:bg-zinc-900 overflow-hidden mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <LogOut className="h-[18px] w-[18px] text-zinc-800 dark:text-zinc-200" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">Account Session</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Manage your current session and sign out of your account.</p>

                        <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white mb-1">Sign Out</h3>
                                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-snug">
                                    Safely end your current session. You can always sign back in.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold px-6 h-10 rounded-lg whitespace-nowrap"
                                onClick={handleSignOut}
                                disabled={logoutLoading}
                            >
                                {logoutLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border border-red-200 dark:border-red-900/50 shadow-sm rounded-xl bg-white dark:bg-zinc-900 overflow-hidden mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="h-[18px] w-[18px] text-red-600 dark:text-red-500" />
                            <h2 className="text-[17px] font-semibold text-red-600 dark:text-red-500 tracking-tight">Danger Zone</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Permanently delete your account and all associated data.</p>

                        <div className="bg-[#fff5f5] dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[15px] font-semibold text-[#b91c1c] dark:text-red-400 mb-1">Delete Account</h3>
                                <p className="text-[13px] text-[#b91c1c] dark:text-red-400/80 leading-snug">
                                    This action cannot be undone. All your CVs, data, and subscription will be permanently deleted.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold px-5 h-10 rounded-lg whitespace-nowrap"
                                onClick={() => {
                                    if (confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
                                        // TODO: Implement hard delete
                                        console.log('Delete account routine');
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function UsageWidget({ title, current, max, barColor, isPro }: { title: string, current: number, max: number, barColor: string, isPro: boolean }) {
    const isOver = !isPro && current >= max;
    const progress = isPro ? 100 : Math.min((current / max) * 100, 100);

    return (
        <div className="border border-zinc-200 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-zinc-900">
            <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest mb-4">{title}</h4>
            <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white leading-none">{current}</span>
                {!isPro && <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-600 leading-none mb-1">/ {max}</span>}
                {isPro && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 px-2 py-1 rounded leading-none mb-0.5 uppercase tracking-wide">Unlimited</span>}
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${isOver ? 'bg-red-500' : (isPro ? 'bg-indigo-600' : barColor)}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
