"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, CreditCard, AlertTriangle, Trash2, LogOut, Globe, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { useLang, type Lang } from '@/lib/i18n';
import { 
    // getEffectivePlan, 
    // isTrialActive, 
    // getDailyKeywordLimit, 
    // TRIAL_LIMITS 
} from '@/lib/permissions';
import Link from 'next/link';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { lang, setLang, t } = useLang();

    // Auth state
    const [email, setEmail] = useState('');
    const [subscription, setSubscription] = useState<any>(null);

    // Usage & License State
    const [usageData, setUsageData] = useState<any>(null);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                // Fetch usage & plan data from unified API
                const res = await fetch('/api/user/usage');
                if (!res.ok) throw new Error("Failed to load usage data");
                const data = await res.json();
                
                setUsageData(data);
                setEmail(data.email || ''); // Assuming we might add email to the API, or keep separate
                setSubscription({
                    plan: data.plan,
                    status: data.status,
                    is_trial: data.trialActive,
                    trial_expiry: data.trialExpiry,
                    current_period_start: data.period.start,
                    current_period_end: data.period.end
                });

                // For email if not in usage API:
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) setEmail(user.email || '');

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

    const plan = subscription?.plan || 'free';
    const trialActive = subscription?.is_trial || false;
    
    // Limits are now handled dynamically via usageData in the JSX

    const getPlanDisplay = () => {
        if (plan === 'lifetime_onetime') return { name: 'Lifetime', color: 'bg-purple-100 text-purple-700' };
        if (plan === 'professional_yearly') return { name: 'Professional', color: 'bg-blue-100 text-blue-700' };
        if (plan === 'starter_monthly') return { name: 'Starter', color: 'bg-indigo-100 text-indigo-700' };
        if (trialActive) return { name: 'Free Trial', color: 'bg-emerald-100 text-emerald-700' };
        return { name: 'Free Plan', color: 'bg-zinc-200 text-zinc-700' };
    };

    const planInfo = getPlanDisplay();

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
                                            {planInfo.name}
                                        </h3>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${planInfo.color}`}>
                                            {subscription?.status === 'active' ? 'ACTIVE' : trialActive ? 'TRIALING' : 'FREE'}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-zinc-500 dark:text-zinc-400 font-medium mb-3">
                                        {plan === 'free' 
                                          ? (trialActive ? "You're enjoying full Professional access during your trial." : "Your trial has expired. Please upgrade.")
                                          : `You have an active ${planInfo.name} subscription.`
                                        }
                                    </p>

                                    {trialActive && subscription?.trial_expiry && (
                                        <div className="inline-flex items-center bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-100 dark:border-orange-500/20">
                                            <span className="text-[13px] font-semibold text-orange-600 dark:text-orange-400">
                                                Trial ends: {format(new Date(subscription.trial_expiry), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {plan !== 'lifetime_onetime' && (
                                    <Link href="/upgrade">
                                        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 h-10 rounded-lg shadow-sm w-full sm:w-auto">
                                            <Sparkles className="w-4 h-4 mr-2" /> Upgrade Plan
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            <UsageWidget
                                title="CV PROJECTS"
                                current={usageData?.usage.cv || 0}
                                max={usageData?.limits.cv === 999 ? null : usageData?.limits.cv}
                                barColor="bg-[#2563eb]"
                            />
                            <UsageWidget
                                title="COVER LETTERS"
                                current={usageData?.usage.letter || 0}
                                max={usageData?.limits.letter === 999 ? null : usageData?.limits.letter}
                                barColor="bg-[#9333ea]"
                            />
                            <UsageWidget
                                title="AI USAGE"
                                current={usageData?.usage.ai || 0}
                                max={usageData?.limits.ai === 999 ? null : usageData?.limits.ai}
                                barColor="bg-[#16a34a]"
                            />
                            <UsageWidget
                                title="JOB SEARCHES"
                                current={usageData?.usage.search || 0}
                                max={usageData?.limits.search === 999 ? null : usageData?.limits.search}
                                barColor="bg-orange-500"
                            />
                            <UsageWidget
                                title="ATS SCANS"
                                current={usageData?.usage.ats || 0}
                                max={usageData?.limits.ats === 999 ? null : usageData?.limits.ats}
                                barColor="bg-rose-500"
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
                                onClick={async () => {
                                    if (confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
                                        try {
                                            const res = await fetch('/api/user/delete', { method: 'DELETE' });
                                            if (!res.ok) throw new Error('Failed to delete account');
                                            // Sign out and redirect
                                            const supabase = (await import('@/lib/supabase/client')).createClient();
                                            await supabase.auth.signOut();
                                            router.push('/login');
                                        } catch (err: any) {
                                            alert('Failed to delete account: ' + err.message);
                                        }
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

function UsageWidget({ title, current, max, barColor }: { title: string, current: number, max: number | null, barColor: string }) {
    const isUnlimited = max === null;
    const isOver = !isUnlimited && current >= max;
    const progress = isUnlimited ? 100 : Math.min((current / max) * 100, 100);

    return (
        <div className="border border-zinc-200 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-zinc-900">
            <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest mb-4">{title}</h4>
            <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white leading-none">{current}</span>
                {!isUnlimited && <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-600 leading-none mb-1">/ {max}</span>}
                {isUnlimited && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 px-2 py-1 rounded leading-none mb-0.5 uppercase tracking-wide">Unlimited</span>}
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${isOver ? 'bg-red-500' : (isUnlimited ? 'bg-indigo-600' : barColor)}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
