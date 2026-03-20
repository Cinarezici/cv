'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'cvoptimizer_onboarding_popup_first_seen';
const SHOW_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

const plans = [
  {
    id: 'starter_monthly',
    label: 'Monthly',
    price: '$24',
    period: '/month',
    badge: null,
    badgeClass: '',
    description: 'Billed monthly, cancel anytime',
    highlight: false,
  },
  {
    id: 'professional_yearly',
    label: 'Yearly',
    price: '$89',
    period: '/year',
    badge: 'MOST POPULAR',
    badgeClass: 'bg-[#6C63FF]',
    description: "That's just $7.42/month — save 69%",
    highlight: true,
  },
  {
    id: 'lifetime_onetime',
    label: 'Lifetime',
    price: '$139',
    period: ' one-time',
    badge: 'BEST VALUE',
    badgeClass: 'bg-gradient-to-r from-orange-500 to-orange-600',
    description: 'Unlimited forever — pay once',
    highlight: false,
  },
] as const;

type PlanId = typeof plans[number]['id'];

const features = [
  { icon: '📄', text: 'Unlimited CVs and profiles' },
  { icon: '🔍', text: 'Unlimited LinkedIn job searches' },
  { icon: '✉️', text: 'Unlimited cover letters' },
  { icon: '💼', text: 'Access to Pro-only roles' },
  { icon: '🎨', text: '6 Premium Resume Templates' },
  { icon: '⬇️', text: 'PDF export on all letters & CVs' },
  { icon: '🔗', text: 'Share links always open — never expire' },
  { icon: '✨', text: 'AI-powered CV optimization, unlimited' },
];

// ── Hook — 48-hour visibility logic ───────────────────────────────────────────
function useShouldShow(): { shouldShow: boolean; dismiss: () => void } {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // First time ever — record timestamp and show
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setShouldShow(true);
        return;
      }
      const elapsed = Date.now() - parseInt(stored, 10);
      if (elapsed < SHOW_DURATION_MS) {
        setShouldShow(true);
      }
    } catch {
      // localStorage not available (SSR, private mode) — don't show
    }
  }, []);

  const dismiss = useCallback(() => {
    setShouldShow(false);
  }, []);

  return { shouldShow, dismiss };
}

// ── Main component ─────────────────────────────────────────────────────────────
export function OnboardingUpgradeModal() {
  const { shouldShow, dismiss } = useShouldShow();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('professional_yearly');
  const [animateIn, setAnimateIn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trigger entry animation after mount
  useEffect(() => {
    if (shouldShow) {
      setVisible(true);
      const tid = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(tid);
    }
  }, [shouldShow]);

  // Close with exit animation
  const handleClose = useCallback(() => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      dismiss();
    }, 350);
  }, [dismiss]);

  // Keyboard: Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (visible) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible, handleClose]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to start checkout');
        setLoading(false);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!visible) return null;

  const selected = plans.find(p => p.id === selectedPlan)!;

  return (
    <>
      {/* --- Global styles — scoped via data attribute --- */}
      <style>{`
        [data-onboarding-modal] {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          scrollbar-width: none;
        }
        [data-onboarding-modal]::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
          transition: 'opacity 0.35s ease',
          opacity: animateIn ? 1 : 0,
        }}
      >
        {/* Modal */}
        <div
          data-onboarding-modal
          style={{
            background: '#18181c',
            border: '1px solid #2a2a32',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '28px 24px 24px',
            position: 'relative',
            transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            opacity: animateIn ? 1 : 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: '#2a2a32',
              border: 'none',
              color: '#888',
              width: 32,
              height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3a3a44'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2a2a32'; (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          >
            ✕
          </button>

          {/* App icon */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          }}>
            ⚡
          </div>

          {/* Title */}
          <div
            id="onboarding-modal-title"
            style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 8 }}
          >
            Welcome to CVOptimizerAI
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 14, color: '#888', lineHeight: 1.55, marginBottom: 22 }}>
            Your 14-day free trial is now active. Explore everything Pro has to offer — then choose the plan that works best for you.
          </div>

          {/* Trial badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(37,99,235,0.3)',
            color: '#93c5fd',
            fontSize: 12,
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: 20,
            marginBottom: 22,
            letterSpacing: '0.02em',
          }}>
            🎉 14-day free trial started
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2a2a32', margin: '0 -24px 20px' }} />

          {/* Section label */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
            What you unlock with Pro
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#ccc' }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: '#222230',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #2a2a32', margin: '0 -24px 20px' }} />

          {/* Section label */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
            Choose your plan
          </div>

          {/* Plans */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {plans.map(plan => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  aria-pressed={isSelected}
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    border: isSelected ? '2px solid #6C63FF' : '2px solid #2a2a32',
                    background: isSelected
                      ? plan.highlight
                        ? 'rgba(108,99,255,0.12)'
                        : 'rgba(108,99,255,0.08)'
                      : '#1e1e24',
                    padding: '12px 10px 10px',
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: 'center',
                    transition: 'border-color 0.2s, background 0.2s',
                    boxShadow: isSelected && plan.highlight
                      ? '0 0 0 1px rgba(108,99,255,0.3), 0 6px 24px rgba(108,99,255,0.15)'
                      : 'none',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: 20,
                      whiteSpace: 'nowrap',
                      background: plan.id === 'professional_yearly'
                        ? '#6C63FF'
                        : 'linear-gradient(90deg, #FF8C00, #FF5500)',
                      color: '#fff',
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 4 }}>{plan.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{plan.price}</div>
                  <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{plan.period}</div>
                  {isSelected && (
                    <div style={{ fontSize: 10, color: '#6C63FF', marginTop: 5, fontWeight: 500 }}>{plan.description}</div>
                  )}
                  {/* Radio dot */}
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '2px solid #6C63FF',
                    margin: '8px auto 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected ? '#6C63FF' : 'transparent',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#fff',
                      opacity: isSelected ? 1 : 0,
                      transition: 'opacity 0.2s',
                    }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trial info */}
          <div style={{ textAlign: 'center', fontSize: 12, color: '#555', marginBottom: 14 }}>
            Your trial ends in <span style={{ color: '#6C63FF', fontWeight: 600 }}>14 days</span>. No charge until then.
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: '100%',
              padding: 16,
              background: loading ? '#4a47aa' : 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              borderRadius: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.15s, box-shadow 0.2s',
              boxShadow: '0 6px 24px rgba(108,99,255,0.35)',
              letterSpacing: '0.01em',
              marginBottom: 12,
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(108,99,255,0.45)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(108,99,255,0.35)';
            }}
          >
            {loading ? 'Redirecting…' : `Upgrade to Pro — ${selected.price}${selected.period} →`}
          </button>

          {/* Maybe later */}
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 13,
              color: '#555',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#555'; }}
          >
            Maybe later
          </button>

          {/* Guarantee */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11.5, color: '#555', marginTop: 10 }}>
            🔒 Secure payment · Cancel anytime
          </div>
        </div>
      </div>
    </>
  );
}
