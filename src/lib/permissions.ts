import { Subscription } from "@/types";

export type PlanIdentifier = 'starter_monthly' | 'professional_yearly' | 'lifetime_onetime' | 'free' | 'lifetime';

// Trial limits definition (from spec)
export const TRIAL_LIMITS = {
  maxCvs: 2,
  maxLetters: 3,
  dailyKeywordQuota: 5,
};

// Returns normalized plan type treating grandfathered users as professional
export function getEffectivePlan(sub: Subscription | null): PlanIdentifier {
  if (!sub) return 'free';
  if (sub.status === 'revoked' || sub.status === 'canceled' || sub.status === 'expired') {
    return 'free';
  }
  
  if (sub.grandfathered) return 'professional_yearly';
  
  // Legacy 'lifetime' is old $99 mapping
  if (sub.plan === 'lifetime') return 'lifetime_onetime';
  
  if (sub.plan === 'professional_yearly') return 'professional_yearly';
  if (sub.plan === 'starter_monthly') return 'starter_monthly';
  if (sub.plan === 'lifetime_onetime') return 'lifetime_onetime';
  
  return 'free';
}

export function isTrialActive(sub: Subscription | null): boolean {
  if (!sub) return false;
  
  if (sub.trial_active && sub.trial_expiry) {
    const expiryDate = new Date(sub.trial_expiry);
    return new Date() < expiryDate;
  }
  
  return false;
}

// -------------------------------------------------------------
// FEATURE FLAGS
// -------------------------------------------------------------

export function canCreateCV(sub: Subscription | null, currentCount: number = 0): boolean {
  const plan = getEffectivePlan(sub);
  
  if (plan !== 'free') return true; // All paid plans have unlimited CVs
  
  if (isTrialActive(sub)) {
    return currentCount < TRIAL_LIMITS.maxCvs;
  }
  
  return currentCount < 1; // Free users get 1 CV
}

export function canCreateCoverLetter(sub: Subscription | null, currentCount: number = 0): boolean {
  const plan = getEffectivePlan(sub);
  
  if (plan !== 'free') return true; // Starter, Pro, Lifetime have unlimited letters
  
  if (isTrialActive(sub)) {
    return currentCount < TRIAL_LIMITS.maxLetters;
  }
  
  return false; // Free users can't create letters outside trial
}

export function canExportPdfWithoutWatermark(sub: Subscription | null): boolean {
  const plan = getEffectivePlan(sub);
  // professional and lifetime get no watermark
  return plan === 'professional_yearly' || plan === 'lifetime_onetime';
}

export function canUseAdvancedAi(sub: Subscription | null): boolean {
  const plan = getEffectivePlan(sub);
  // Starter has basic AI. Pro/Lifetime have advanced. Trial has basic AI.
  return plan === 'professional_yearly' || plan === 'lifetime_onetime';
}

export function canUseLinkedInAutoTailor(sub: Subscription | null): boolean {
  const plan = getEffectivePlan(sub);
  return plan === 'professional_yearly' || plan === 'lifetime_onetime';
}

export function canAccessBrandedLinks(sub: Subscription | null): boolean {
  const plan = getEffectivePlan(sub);
  return plan === 'professional_yearly' || plan === 'lifetime_onetime';
}

export function hasUnlimitedKeywords(sub: Subscription | null): boolean {
  const plan = getEffectivePlan(sub);
  return plan === 'professional_yearly' || plan === 'lifetime_onetime';
}

export function getDailyKeywordLimit(sub: Subscription | null): number {
  if (hasUnlimitedKeywords(sub)) return 999999;
  
  const plan = getEffectivePlan(sub);
  if (plan === 'starter_monthly') return 10;
  
  if (isTrialActive(sub)) return TRIAL_LIMITS.dailyKeywordQuota;
  
  return 0; // Free users have 0
}

export function isUsageLimitExceeded(used: number, limit: number): boolean {
  return used >= limit;
}
