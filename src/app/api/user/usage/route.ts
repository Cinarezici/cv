import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkUsage } from "@/lib/usage-enforcement";
import { getLimitsForPlan } from "@/config/plans";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 1. Fetch Subscription to get the plan and period
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        const planId = sub?.plan || 'free';
        const limits = getLimitsForPlan(planId);

        // 2. Fetch specific usage for key features
        const [cvUsage, aiUsage, letterUsage, searchUsage, atsUsage] = await Promise.all([
            checkUsage(user.id, 'cv_generation'),
            checkUsage(user.id, 'ai_optimization'),
            checkUsage(user.id, 'letter_generation'),
            checkUsage(user.id, 'job_search'),
            checkUsage(user.id, 'ats_scan')
        ]);

        return NextResponse.json({
            plan: planId,
            status: sub?.status || 'inactive',
            trialActive: sub?.is_trial || false,
            trialExpiry: sub?.trial_expiry || null,
            limits: {
                cv: limits.cv_limit,
                ai: limits.ai_limit,
                letter: limits.letter_limit,
                search: limits.job_search_limit,
                ats: limits.ats_scan_limit,
                advancedAi: limits.advanced_ai,
                watermarkFree: limits.watermark_free
            },
            usage: {
                cv: cvUsage.usage || 0,
                ai: aiUsage.usage || 0,
                letter: letterUsage.usage || 0,
                search: searchUsage.usage || 0,
                ats: atsUsage.usage || 0
            },
            period: {
                start: sub?.current_period_start || null,
                end: sub?.current_period_end || null
            }
        });

    } catch (err: any) {
        console.error("Usage API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
