import { createClient } from "@supabase/supabase-js";
import { getLimitsForPlan, PlanFeature } from "@/config/plans";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Checks if a user has sufficient quota to perform a feature-specific action.
 * Returns { allowed: boolean, reason?: string, usage?: number, limit?: number }
 */
export async function checkUsage(userId: string, feature: PlanFeature) {
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

  const isTrial = sub.is_trial || false;
  const planId = isTrial ? 'trial' : (sub.plan || 'free');
  const limits = getLimitsForPlan(planId);
  const limit = (limits as any)[`${feature.split('_')[0]}_limit`] || 0;

  // 2. Fetch Current Usage for the relevant period
  // For monthly/yearly plans, we check usage within current_period_start/end
  // For lifetime/trial, we use the start date to define the unique bucket
  const periodStart = sub.current_period_start || new Date(0).toISOString();

  const { data: usage, error: usageError } = await supabase
    .from('usage_tracking')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('period_start', periodStart)
    .maybeSingle();

  const currentCount = usage?.usage_count || 0;

  if (currentCount >= limit && limit !== 999) {
    return { 
      allowed: false, 
      reason: 'limit_exceeded', 
      usage: currentCount, 
      limit,
      plan: planId 
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
