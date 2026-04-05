-- ==========================================
-- CRO & Revenue Optimization Sprint SQL
-- ==========================================

-- 1. Referral System Schema
-- ------------------------------------------
-- Add referral metadata to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referrer_id UUID REFERENCES public.profiles(id);

-- Create dedicated referrals tracking table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) NOT NULL,
    referred_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'upgraded', 'rewarded')),
    credits_awarded NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for lookup performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);

-- 2. Onboarding System Schema
-- ------------------------------------------
-- Track detailed onboarding progress in JSONB for flexibility
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{"upload_cv": false, "first_scan": false, "view_suggestions": false, "profile_complete": false}'::JSONB;

-- 3. Plan Enforcement Updates
-- ------------------------------------------
-- Ensure usage_tracking has a feature_name for 'ats_scan'
-- (Assuming usage_tracking table exists as per usage-enforcement.ts)

-- 4. Triggers for Automatic Referral Reward (Conceptual)
-- ------------------------------------------
-- You would typically use a function that checks for a subscription upgrade
-- and awards the reward to the referrer.

/*
CREATE OR REPLACE FUNCTION award_referral_bonus() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
        UPDATE public.referrals 
        SET status = 'rewarded', credits_awarded = 10 
        WHERE referred_id = NEW.user_id AND status != 'rewarded';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/
