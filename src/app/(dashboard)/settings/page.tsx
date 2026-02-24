"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, CreditCard, AlertTriangle, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LIMITS } from '@/lib/limits-config';
import { format, addDays } from 'date-fns';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                if (authErr || !user) throw new Error("Could not fetch user data");

                setEmail(user.email || 'No email associated');

                // Fetch subscription
                const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
                if (sub) setSubscription(sub);

                // Calculate Trial / Reset Dates (14 days from account creation)
                const creationDate = new Date(user.created_at || new Date());
                const _trialEndDate = new Date(creationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                const diffDays = Math.ceil((_trialEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                setTrialDaysLeft(diffDays > 0 ? diffDays : 0);
                setNextResetDate(_trialEndDate);

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
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    const isPro = subscription?.status === 'active';

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 bg-[#fafafa] min-h-[calc(100vh-100px)] text-zinc-900 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-zinc-500 text-[15px]">Manage your account and subscription preferences.</p>
            </div>

            {error && <div className="mb-6 text-sm font-medium text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">{error}</div>}

            <div className="space-y-6">
                {/* Account Information */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="h-[18px] w-[18px] text-zinc-800" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 tracking-tight">Account Information</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 mb-6 font-medium">Your personal account details.</p>

                        <div className="space-y-2 max-w-full">
                            <label className="text-[13px] font-semibold text-zinc-900">Email</label>
                            <Input
                                value={email}
                                disabled
                                className="h-11 bg-zinc-50 border-none text-zinc-900 cursor-not-allowed text-[14px] rounded-lg w-full"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Plan & Limits */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="h-[18px] w-[18px] text-zinc-800" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 tracking-tight">Plan & Limits</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 mb-6 font-medium">Manage your subscription and view usage limits.</p>

                        <div className="border border-zinc-200 rounded-xl p-5 mb-4 bg-[#fcfcfc]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h3 className="text-[18px] font-bold text-zinc-900">
                                            {isPro ? 'Pro Plan' : 'Free Plan'}
                                        </h3>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-200 text-zinc-700'}`}>
                                            {isPro ? 'ACTIVE' : 'LIMITED'}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-zinc-500 font-medium mb-3">
                                        {isPro ? 'Enjoy unlimited access to all features.' : 'Your limits reset every 14 days.'}
                                    </p>

                                    {!isPro && (
                                        <div className="inline-flex items-center bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100">
                                            <span className="text-[13px] font-semibold text-orange-600">
                                                Next Reset: {format(nextResetDate, 'M/d/yyyy')} ({trialDaysLeft} days left)
                                            </span>
                                        </div>
                                    )}
                                    {isPro && subscription?.current_period_end && (
                                        <div className="inline-flex items-center bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100">
                                            <span className="text-[13px] font-semibold text-indigo-600">
                                                Renews on: {format(new Date(subscription.current_period_end), 'M/d/yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {!isPro && (
                                    <Button
                                        onClick={() => window.location.href = '/upgrade'}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 h-10 rounded-lg shadow-sm w-full sm:w-auto"
                                    >
                                        Upgrade to Pro
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UsageWidget
                                title="CV PROJECTS"
                                current={cvCount}
                                max={LIMITS.MAX_CVS_TRIAL}
                                barColor="bg-[#2563eb]" // Blue
                                isPro={isPro}
                            />
                            <UsageWidget
                                title="COVER LETTERS"
                                current={letterCount}
                                max={LIMITS.MAX_LETTERS_TRIAL}
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
                <Card className="border border-zinc-200 shadow-sm rounded-xl bg-white overflow-hidden mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <LogOut className="h-[18px] w-[18px] text-zinc-800" />
                            <h2 className="text-[17px] font-semibold text-zinc-900 tracking-tight">Account Session</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 mb-6 font-medium">Manage your current session and sign out of your account.</p>

                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[15px] font-semibold text-zinc-900 mb-1">Sign Out</h3>
                                <p className="text-[13px] text-zinc-500 leading-snug">
                                    Safely end your current session. You can always sign back in.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold px-6 h-10 rounded-lg whitespace-nowrap"
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
                <Card className="border border-red-200 shadow-sm rounded-xl bg-white overflow-hidden mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="h-[18px] w-[18px] text-red-600" />
                            <h2 className="text-[17px] font-semibold text-red-600 tracking-tight">Danger Zone</h2>
                        </div>
                        <p className="text-[14px] text-zinc-500 mb-6 font-medium">Permanently delete your account and all associated data.</p>

                        <div className="bg-[#fff5f5] border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[15px] font-semibold text-[#b91c1c] mb-1">Delete Account</h3>
                                <p className="text-[13px] text-[#b91c1c] leading-snug">
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
        <div className="border border-zinc-200 rounded-xl p-5 bg-white">
            <h4 className="text-[11px] font-bold text-zinc-400 tracking-widest mb-4">{title}</h4>
            <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-zinc-900 leading-none">{current}</span>
                {!isPro && <span className="text-sm font-semibold text-zinc-400 leading-none mb-1">/ {max}</span>}
                {isPro && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded leading-none mb-0.5 uppercase tracking-wide">Unlimited</span>}
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${isOver ? 'bg-red-500' : (isPro ? 'bg-indigo-600' : barColor)}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
