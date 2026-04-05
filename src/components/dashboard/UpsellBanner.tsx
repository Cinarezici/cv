'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePro } from '@/hooks/usePro';

const trackEvent = (action: string, label: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: 'Upsell',
      event_label: label,
    });
  }
};

export const UpsellBanner = () => {
  const { plan, isLoading } = usePro();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Only show for monthly users
    if (plan !== 'starter_monthly') return;

    const dismissedUntil = localStorage.getItem('hide_annual_upsell_until');
    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil)) {
      return;
    }

    setIsVisible(true);
    trackEvent('upsell_banner_impression', 'Annual Plan');
  }, [plan, isLoading]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Hide for 14 days
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    localStorage.setItem('hide_annual_upsell_until', (new Date().getTime() + fourteenDays).toString());
  };

  const handleUpgrade = () => {
    trackEvent('upsell_banner_clicked', 'Annual Plan Upgrade');
    window.location.href = '/pricing';
  };

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-zinc-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 animate-in slide-in-from-top duration-500">
      <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
        <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 34.1%, 74.8% 41.9%)' }} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-white font-medium">
          <Sparkles className="inline-block w-4 h-4 mr-2 text-indigo-400" />
          <strong className="font-bold">Switch to Annual and save 2 months</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
          Get full access for $89/yr instead of $288/yr
        </p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="rounded-full bg-white px-4 py-1 text-xs font-black text-zinc-900 shadow-sm hover:bg-zinc-100 transition-all active:scale-95"
          onClick={handleUpgrade}
        >
          Switch to Annual <ArrowRight className="ml-2 w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={handleDismiss}>
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5 text-white/60 hover:text-white transition-colors" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
