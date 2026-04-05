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
        // Query referrals with status 'upgraded' to count successful conversions
        const { count, error } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', user.id)
          .eq('status', 'upgraded');
        
        setStats({ 
          referred_count: count || 0, 
          reward_status: (count || 0) >= 2 ? 'earned' : 'pending' 
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

  const progress = Math.min((stats.referred_count / 2) * 100, 100);
  const remaining = Math.max(2 - stats.referred_count, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold">
              <Gift className="w-4 h-4 text-amber-400" />
              Limited Time: Refer & Earn
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Get 1 Month <span className="text-amber-400">Pro</span> for Free.
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed">
              Invite 2 friends to CV Optimizer AI. When they upgrade to any paid plan, we'll give you <span className="font-bold text-white">30 days of Pro access</span> instantly.
            </p>
          </div>

          <div className="w-full lg:w-80 flex flex-col items-center gap-6 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl font-black mb-1">{stats.referred_count}<span className="text-2xl text-white/40">/2</span></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Friends Upgraded</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full space-y-3">
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-center text-indigo-100">
                {remaining > 0 ? `${remaining} more friend${remaining === 1 ? '' : 's'} to go!` : "Reward achieved!"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-black bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/30 w-full justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
              {stats.reward_status === 'earned' ? 'MONTHLY REWARD EARNED' : 'GOAL: 1 MONTH FREE'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Share Your Link</h2>
              <p className="text-sm text-zinc-500">Copy your unique invite link below.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-[1.25rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-1.5 pl-5 transition-all group-hover:border-indigo-500/30">
                <div className="flex-1 min-w-0 mr-4">
                  <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 truncate block font-mono">
                    {referralLink}
                  </span>
                </div>
                <button 
                  onClick={copyLink} 
                  className={`px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 ${
                    copied 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium pl-1">
              Share this link via <span className="text-zinc-300">LinkedIn, Slack, or Email</span>. When someone joins using your link, they&apos;ll be tracked as your referral.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">How it Works</h2>
              <p className="text-sm text-zinc-500">Simple three-step reward process.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              { icon: Share2, title: 'Share Link', desc: 'Send your invite link to friends who need a better CV.' },
              { icon: Users, title: 'They Sign Up', desc: 'Your friends create an account and start their 14-day trial.' },
              { icon: Trophy, title: 'Get Reward', desc: 'Once 2 friends upgrade to Pro, you get 1 month added to your account.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200 dark:border-white/5">
                  <step.icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold">{step.title}</h3>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
