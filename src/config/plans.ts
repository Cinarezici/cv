export type PlanFeature = 'cv_generation' | 'ai_optimization' | 'letter_generation' | 'job_search' | 'ats_scan';

export interface PlanLimits {
  cv_limit: number;
  ai_limit: number;
  letter_limit: number;
  job_search_limit: number;
  ats_scan_limit: number;
  advanced_ai: boolean;
  watermark_free: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    cv_limit: 1,
    ai_limit: 1,
    letter_limit: 1,
    job_search_limit: 0,
    ats_scan_limit: 3,
    advanced_ai: false,
    watermark_free: false,
  },
  trial: {
    cv_limit: 2,
    ai_limit: 5,
    letter_limit: 3,
    job_search_limit: 2,
    ats_scan_limit: 3,
    advanced_ai: true,
    watermark_free: true,
  },
  starter_monthly: {
    cv_limit: 999,
    ai_limit: 30,
    letter_limit: 999,
    job_search_limit: 999,
    ats_scan_limit: 10,
    advanced_ai: true,
    watermark_free: true,
  },
  professional_yearly: {
    cv_limit: 999,
    ai_limit: 999,
    letter_limit: 999,
    job_search_limit: 999,
    ats_scan_limit: 999,
    advanced_ai: true,
    watermark_free: true,
  },
  lifetime_onetime: {
    cv_limit: 999,
    ai_limit: 999,
    letter_limit: 999,
    job_search_limit: 999,
    ats_scan_limit: 999,
    advanced_ai: true,
    watermark_free: true,
  },
};

export function getLimitsForPlan(planId: string): PlanLimits {
  return PLAN_LIMITS[planId] || PLAN_LIMITS.free;
}
