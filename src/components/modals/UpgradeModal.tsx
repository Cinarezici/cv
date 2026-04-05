'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap, Sparkles, Rocket, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trackEvent = (action: string, label: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: 'Conversion',
      event_label: label,
    });
  }
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      trackEvent('upgrade_modal_shown', 'Usage Limit Reached');
    }
  }, [isOpen]);

  const handleUpgrade = (plan: string) => {
    trackEvent('upgrade_modal_clicked', plan);
    router.push('/pricing');
  };

  const plans = [
    {
      name: 'Monthly',
      price: '$24',
      period: '/mo',
      description: 'Perfect for a quick job search boost.',
      icon: <Zap className="w-5 h-5 text-indigo-500" />,
      features: ['Unlimited ATS Checks', 'Detailed Scoring', 'AI Rewrites'],
      buttonText: 'Start Trial',
      popular: false,
    },
    {
      name: 'Annual',
      price: '$89',
      period: '/yr',
      description: 'The pro choice for serious candidates.',
      icon: <Rocket className="w-5 h-5 text-violet-500" />,
      features: ['Save 38% vs Monthly', 'Priority AI Models', 'Expert Support'],
      buttonText: 'Go Annual',
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$139',
      period: ' once',
      description: 'Full power forever. No recurring fees.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      features: ['Lifetime Access', 'All Future features', 'Elite Templates'],
      buttonText: 'Get Lifetime',
      popular: false,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:bg-zinc-950">
        <div className="relative overflow-hidden bg-zinc-900 px-8 py-12 text-center text-white">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] -mr-40 -mt-40 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-600/10 blur-[80px] -ml-20 -mb-20 rounded-full" />
            
            <DialogHeader className="relative z-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                    <Rocket className="w-8 h-8 text-indigo-400" />
                </div>
                <DialogTitle className="text-4xl font-black tracking-tight text-white md:text-5xl">
                    Free scans completed.
                </DialogTitle>
                <DialogDescription className="text-zinc-400 text-lg max-w-lg mx-auto font-medium">
                    You&apos;ve reached the free limit. Unlock unlimited scans and AI rewrites to land your next role 3x faster.
                </DialogDescription>
            </DialogHeader>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 -mt-10">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -5 }}
              className={`relative flex flex-col p-6 rounded-3xl border-2 transition-all shadow-xl ${
                plan.popular 
                    ? 'border-indigo-600 bg-white ring-8 ring-indigo-600/5' 
                    : 'border-zinc-100 bg-white dark:bg-zinc-900 dark:border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Best Value
                </div>
              )}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center">
                    {plan.icon}
                </div>
                <h3 className="font-black text-lg tracking-tight uppercase">{plan.name}</h3>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-zinc-400 text-sm font-bold uppercase ml-1">{plan.period}</span>
              </div>
              <p className="text-xs text-zinc-500 font-bold mb-8 min-h-[32px]">{plan.description}</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[13px] font-bold text-zinc-600 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full font-black h-12 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
                  plan.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20' 
                    : 'bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-zinc-900 border-0 shadow-zinc-900/10'
                }`}
                onClick={() => handleUpgrade(plan.name)}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="px-8 pb-10 text-center">
          <button
            className="text-zinc-400 hover:text-zinc-600 text-xs font-bold underline underline-offset-4 transition-colors"
            onClick={onClose}
          >
            I&apos;ll upgrade later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
