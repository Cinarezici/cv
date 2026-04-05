'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Tag, ArrowRight, Percent, 
  Sparkles, MousePointer2 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only on Desktop
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const handleMouseOut = (e: MouseEvent) => {
      // Detect mouse leaving through the top
      if (!hasShown && e.clientY <= 0) {
        const sessionShown = sessionStorage.getItem('exit_popup_shown');
        if (!sessionShown) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem('exit_popup_shown', 'true');
          
          if ((window as any).gtag) {
            (window as any).gtag('event', 'exit_intent_shown', {
              event_category: 'Conversion',
              event_label: 'Exit Intent Popup'
            });
          }
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseOut);
    return () => document.removeEventListener('mouseleave', handleMouseOut);
  }, [hasShown]);

  const handleClaim = () => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_claimed', {
        event_category: 'Conversion',
        event_label: 'Exit Intent Popup'
      });
    }
    window.location.href = '/pricing?code=FIRST20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 shadow-3xl">
        <div className="relative h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="p-10 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center relative">
            <Percent className="w-10 h-10 text-indigo-600 drop-shadow-sm" />
            <Sparkles className="absolute top-0 right-0 w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight text-zinc-950">
                Wait - grab 20% off before you go
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-[16px] font-medium leading-relaxed">
                Use code <span className="font-bold text-indigo-600">FIRST20</span> at checkout for 20% off your first month or annual plan. Exclusive offer for new users.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col items-center gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Your Discount Code</div>
            <div className="text-xl font-black text-zinc-900 border-2 border-dashed border-indigo-200 px-6 py-2 rounded-xl bg-white select-all cursor-copy">
              FIRST20
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleClaim} 
              className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[15px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Claim 20% Off <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="link" 
              className="text-zinc-400 hover:text-zinc-600 text-xs font-medium" 
              onClick={() => setIsOpen(false)}
            >
              No thanks, I'll pay full price later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
