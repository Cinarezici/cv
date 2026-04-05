'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, Gift, Copy, Check, Share2, Award, 
  ArrowRight, ShieldCheck, Trophy, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ referred_count: 0, reward_status: 'pending' });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // In a real implementation, we'd query the 'referrals' table
        // For now, we fetch the count of their referrals
        const { count, error } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', user.id)
          .eq('status', 'paid');
        
        setStats({ 
          referred_count: count || 0, 
          reward_status: (count || 0) > 0 ? 'earned' : 'pending' 
        });
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const referralLink = user ? `${window.location.origin}/signup?ref=${user.id.split('-')[0]}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-violet-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight">Invite friends, get Pro.</h1>
            <p className="text-indigo-100 text-lg max-w-md font-medium">
              Share CV Optimizer AI with your network. When they upgrade, you both get rewarded with $10 in account credit.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
            <div className="text-center">
              <span className="text-5xl font-black">{stats.referred_count}</span>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mt-1">Friends Referred</p>
            </div>
            <div className="h-px w-full bg-white/20" />
            <div className="flex items-center gap-2 text-sm font-bold bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              {stats.reward_status === 'earned' ? 'Reward Earned' : 'Next Reward: $10 Credits'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold">Your Referral Link</h2>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 flex items-center overflow-hidden">
              <span className="text-sm font-medium text-zinc-500 truncate">{referralLink}</span>
            </div>
            <Button 
              onClick={copyLink} 
              className={`rounded-xl px-6 font-bold flex items-center gap-2 transition-all ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-sm text-zinc-400">Share this link via Slack, LinkedIn, or Email to start earning rewards.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-bold">How it works</h2>
          </div>
          <ul className="space-y-4">
            {[
              { icon: Share2, title: 'Share your link', desc: 'Send your unique link to friends looking to optimize their resumes.' },
              { icon: Users, title: 'They sign up', desc: 'When they join CV Optimizer AI, they start their career growth journey.' },
              { icon: Trophy, title: 'You get rewarded', desc: 'When they upgrade to a paid plan, $10 is added to your account instantly.' }
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                  <step.icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{step.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
