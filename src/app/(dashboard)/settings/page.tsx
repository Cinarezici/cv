"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, User, Key, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Auth state
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [subscription, setSubscription] = useState<any>(null);
    const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0);

    // Profile state
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');
    const [headline, setHeadline] = useState('');
    const [summary, setSummary] = useState('');

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                const supabase = createClient();
                const { data: { user }, error: authErr } = await supabase.auth.getUser();
                if (authErr || !user) throw new Error("Could not fetch user data");

                setEmail(user.email || 'No email');
                setUserId(user.id);

                // Fetch subscription
                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (sub) setSubscription(sub);

                // Fetch profiles
                const { data: profs } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (profs && profs.length > 0) {
                    setProfiles(profs);
                    const defaultProf = profs[0];
                    setSelectedProfileId(defaultProf.id);
                    setHeadline(defaultProf.headline || '');
                    setSummary(defaultProf.raw_json?.summary || '');

                    // Calculate Trial
                    const creationDate = new Date(profs[profs.length - 1].created_at);
                    const _trialEndDate = new Date(creationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                    const diffDays = Math.ceil((_trialEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    setTrialDaysLeft(diffDays);
                } else {
                    // Check user creation for trial if no profiles
                    const { data: userData } = await supabase.auth.getUser();
                    if (userData?.user?.created_at) {
                        const creationDate = new Date(userData.user.created_at);
                        const _trialEndDate = new Date(creationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                        const diffDays = Math.ceil((_trialEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        setTrialDaysLeft(diffDays);
                    }
                }

            } catch (err: any) {
                console.error(err);
                setError("Gerekli bilgiler yüklenirken hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettingsData();
    }, []);

    const handleProfileSelect = (id: string) => {
        const p = profiles.find(x => x.id === id);
        if (p) {
            setSelectedProfileId(p.id);
            setHeadline(p.headline || '');
            setSummary(p.raw_json?.summary || '');
        }
    };

    const handleSaveProfile = async () => {
        if (!selectedProfileId) return;
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const supabase = createClient();

            // Need to fetch current json to not overwrite the whole raw_json accidentally
            const { data: currentProf } = await supabase
                .from('profiles')
                .select('raw_json')
                .eq('id', selectedProfileId)
                .single();

            const updatedRawJson = {
                ...(currentProf?.raw_json || {}),
                summary: summary
            };

            const { error: updateErr } = await supabase
                .from('profiles')
                .update({
                    headline,
                    raw_json: updatedRawJson
                })
                .eq('id', selectedProfileId);

            if (updateErr) throw updateErr;

            setSuccessMsg("Profil başarıyla güncellendi.");
            setTimeout(() => setSuccessMsg(null), 4000);

            // Update local state
            setProfiles(profiles.map(p => p.id === selectedProfileId ? { ...p, headline, raw_json: updatedRawJson } : p));

        } catch (err: any) {
            console.error(err);
            setError("Profil güncellenirken bir hata oluştu: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-zinc-50">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 bg-zinc-50 min-h-[calc(100vh-100px)] text-zinc-900">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your profile, account details, and subscription setup.</p>
            </div>

            {error && <div className="text-sm font-medium text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">{error}</div>}
            {successMsg && <div className="text-sm font-medium text-emerald-600 bg-emerald-50 p-4 rounded-lg border border-emerald-200">{successMsg}</div>}

            {/* Profile Information */}
            <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-xl font-bold">Editlemek İçin CV'ni Seç</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-500">
                        Select a CV profile to update your headline and summary.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                    {profiles.length === 0 ? (
                        <p className="text-sm text-zinc-500">Sistemde kayıtlı bir profil bulunamadı. Lütfen önce "Import" sayfasından profil yükleyin.</p>
                    ) : (
                        <>
                            {profiles.length > 1 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700">Select Profile to Edit</label>
                                    <select
                                        className="flex h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                                        value={selectedProfileId}
                                        onChange={(e) => handleProfileSelect(e.target.value)}
                                    >
                                        {profiles.map(p => (
                                            <option key={p.id} value={p.id}>{p.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">LinkedIn Headline</label>
                                <Input
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    className="h-11 bg-zinc-50"
                                    placeholder="e.g. Senior Software Engineer at Google"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">Professional Summary</label>
                                <Textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="min-h-[160px] bg-zinc-50 resize-y"
                                    placeholder="Write a brief summary of your professional experience..."
                                />
                            </div>

                            <Button onClick={handleSaveProfile} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-zinc-600" />
                        <CardTitle className="text-xl font-bold">Account Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700">Email Address</label>
                        <Input
                            value={email}
                            disabled
                            className="h-11 bg-zinc-100 text-zinc-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700">User ID</label>
                        <Input
                            value={userId}
                            disabled
                            className="h-11 bg-zinc-100 text-zinc-500 cursor-not-allowed font-mono text-xs"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-emerald-600" />
                        <CardTitle className="text-xl font-bold">Subscription Plan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                        <div>
                            <p className="font-bold text-zinc-900 text-lg">
                                {subscription?.status === 'active' ? 'Pro Plan' : 'Free Plan'}
                            </p>
                            <div className="text-sm text-zinc-500 flex flex-col mt-1 space-y-1">
                                <div>
                                    Status: <span className={`font-semibold ${subscription?.status === 'active' ? 'text-emerald-600' : 'text-zinc-600'}`}>
                                        {subscription?.status === 'active' ? 'Active' : (subscription?.status === 'expired' || subscription?.status === 'canceled' ? 'Canceled' : (trialDaysLeft > 0 ? 'Trial' : 'Expired'))}
                                    </span>
                                </div>
                                {subscription?.status !== 'active' && trialDaysLeft > 0 && (
                                    <div className="text-amber-600 font-medium">✨ {trialDaysLeft} days remaining on Free Trial</div>
                                )}
                                {subscription?.status !== 'active' && trialDaysLeft <= 0 && (
                                    <div className="text-rose-600 font-medium">⚠️ Trial Expired</div>
                                )}
                            </div>
                        </div>
                        {subscription?.status !== 'active' && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" onClick={() => window.location.href = '/upgrade'}>
                                Upgrade to Pro
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
