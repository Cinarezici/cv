import { createServiceRoleClient } from "@/lib/supabase/service";
import { getLimitsForPlan, PlanFeature, PlanLimits } from "@/config/plans";

/**
 * Checks if a user has sufficient quota to perform a feature-specific action.
 * Returns { allowed: boolean, reason?: string, usage?: number, limit?: number }
 */
export async function checkUsage(userId: string, feature: PlanFeature) {
  const supabase = createServiceRoleClient();
  // 1. Fetch Subscription State
  const { data: sub, error: subError } = await supabase
    .from('subscriptions')
    .select('plan, status, is_trial, current_period_start, current_period_end')
    .eq('user_id', userId)
    .single();

  if (subError || !sub) {
    // Default to free limits if no subscription record found
    return { allowed: false, reason: 'no_subscription', plan: 'free' };
  }

  const subStatus = sub.status || 'free';
  const isTrial = sub.is_trial || subStatus === 'trialing';
  const planId = isTrial ? 'trial' : (sub.plan || 'free');
  const limits = getLimitsForPlan(planId);
  
  // Maps feature name to its corresponding limit property in PLAN_LIMITS
  const limitMap: Record<PlanFeature, keyof PlanLimits> = {
    cv_generation: 'cv_limit',
    ai_optimization: 'ai_limit',
    letter_generation: 'letter_limit',
    job_search: 'job_search_limit',
    ats_scan: 'ats_scan_limit'
  };

  const limit = limits[limitMap[feature]] || 0;

  // 2. Fetch Current Usage for the relevant period
  // For monthly/yearly plans, we check usage within current_period_start/end
  // For daily features (like ATS scan), we use the current date at 00:00:00
  const isDailyFeature = feature === 'ats_scan' && ['starter_monthly', 'professional_yearly', 'lifetime_onetime'].includes(planId);
  
  let periodStart;
  if (isDailyFeature) {
    const now = new Date();
    periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  } else {
    periodStart = sub.current_period_start || new Date(0).toISOString();
  }

  const { data: usage, error: usageError } = await supabase
    .from('usage_tracking')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('period_start', periodStart)
    .maybeSingle();

  const currentCount = usage?.usage_count || 0;

  if (currentCount >= limit && limit !== 999) {
    const frequency = isDailyFeature ? 'daily ' : '';
    return { 
      allowed: false, 
      reason: 'limit_exceeded', 
      usage: currentCount, 
      limit,
      plan: planId,
      message: `Your ${frequency}ATS scan limit (${limit}) has been reached. Please upgrade or wait for the next period.`
    };
  }

  return { 
    allowed: true, 
    usage: currentCount, 
    limit,
    periodStart: periodStart
  };
}

/**
 * Atomically increments usage for a feature.
 */
export async function incrementUsage(userId: string, feature: PlanFeature, periodStart: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.rpc('increment_usage', {
    target_user_id: userId,
    target_feature: feature,
    current_period_start: periodStart
  });

  if (error) {
    console.error(`Error incrementing usage for ${userId}/${feature}:`, error);
    throw error;
  }
}
