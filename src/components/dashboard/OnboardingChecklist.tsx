'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Trophy, ArrowRight,
  FileUp, ScanSearch, Sparkles, UserCircle,
  ChevronDown, ChevronUp, Gift, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Progress } from "@/components/ui/progress";

export const OnboardingChecklist = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [steps, setSteps] = useState([
    { id: 'upload', label: 'Upload your first CV', completed: false, icon: FileUp, link: '/import' },
    { id: 'scan', label: 'Run an ATS scan', completed: false, icon: ScanSearch, link: '/ats-scanner' },
    { id: 'review', label: 'Review AI suggestions', completed: false, icon: Sparkles, link: '/resumes/new' },
    { id: 'profile', label: 'Complete your profile', completed: false, icon: UserCircle, link: '/settings' },
  ]);

  useEffect(() => {
    async function checkProgress() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dismissed = localStorage.getItem('onboarding_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
        return;
      }

      // Check CVs
      const { count: cvCount } = await supabase.from('resumes').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      
      // Check Scans (from usage_tracking)
      const { data: usage } = await supabase.from('usage_tracking').select('usage_count').eq('user_id', user.id).eq('feature_name', 'ats_scan').maybeSingle();
      
      // Check Profile
      const { data: profile } = await supabase.from('profiles').select('name, bio').eq('user_id', user.id).maybeSingle();

      setSteps(prev => prev.map(step => {
        if (step.id === 'upload') return { ...step, completed: (cvCount || 0) > 0 };
        if (step.id === 'scan') return { ...step, completed: (usage?.usage_count || 0) > 0 };
        if (step.id === 'review') return { ...step, completed: (usage?.usage_count || 0) > 0 }; // Approximation
        if (step.id === 'profile') return { ...step, completed: !!profile?.name };
        return step;
      }));
      setLoading(false);
    }
    checkProgress();
  }, []);

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const allCompleted = completedCount === steps.length;

  if (isDismissed || loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-500/10 transition-all duration-300">
        {/* Header */}
        <div className="bg-zinc-50 dark:bg-white/5 p-4 flex items-center justify-between cursor-pointer border-b border-zinc-100 dark:border-white/5" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900 dark:text-white">Getting Started</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{completedCount} of {steps.length} steps complete</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronUp className="w-4 h-4 text-zinc-400" />}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <Progress value={progress} className="h-1.5" />
                
                <div className="space-y-1">
                  {steps.map((step) => (
                    <a 
                      key={step.id} 
                      href={step.link}
                      className={`flex items-center gap-3 p-2 rounded-xl transition-all ${step.completed ? 'opacity-60' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}`}
                    >
                      {step.completed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                          <Circle className="w-3 h-3 text-transparent" />
                        </div>
                      )}
                      <span className={`text-[13px] font-bold ${step.completed ? 'line-through text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {step.label}
                      </span>
                      {!step.completed && <ArrowRight className="w-3 h-3 ml-auto text-zinc-300" />}
                    </a>
                  ))}
                </div>

                {allCompleted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                      <Gift className="w-4 h-4" /> REWARD UNLOCKED
                    </p>
                    <p className="text-[10px] font-bold text-emerald-700/60 mt-1 uppercase">Use code COMPLETE50 for 50% off</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsDismissed(true);
                      localStorage.setItem('onboarding_dismissed', 'true');
                    }}
                    className="w-full text-[11px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
                  >
                    Dismiss checklist
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
