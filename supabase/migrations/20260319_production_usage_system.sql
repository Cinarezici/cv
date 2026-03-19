-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    price_monthly_cents integer,
    price_yearly_cents integer,
    price_lifetime_cents integer,
    limits jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Usage Tracking Table (Scalable per feature)
CREATE TABLE IF NOT EXISTS usage_tracking (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature text NOT NULL, -- e.g., 'cv_generation', 'ai_optimization', 'letter_generation'
    usage_count integer DEFAULT 0,
    max_limit integer, -- Optional: cache limit from plan
    period_start timestamp with time zone NOT NULL DEFAULT now(),
    period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, feature, period_start)
);

-- 3. Enhance Subscriptions Table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS current_period_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS current_period_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_trial boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS price_id text; -- Helpful for sync

-- 4. Sample Data for Plans
INSERT INTO plans (id, name, limits) VALUES 
('free', 'Free Layer', '{"cv_limit": 1, "ai_limit": 0, "letter_limit": 0}'::jsonb),
('trial', '14-Day Pro Trial', '{"cv_limit": 2, "ai_limit": 5, "letter_limit": 3}'::jsonb),
('starter_monthly', 'Starter', '{"cv_limit": 999, "ai_limit": 30, "letter_limit": 999}'::jsonb),
('professional_yearly', 'Professional', '{"cv_limit": 999, "ai_limit": 999, "letter_limit": 999}'::jsonb),
('lifetime_onetime', 'Lifetime', '{"cv_limit": 999, "ai_limit": 999, "letter_limit": 999}'::jsonb)
ON CONFLICT (id) DO UPDATE SET limits = EXCLUDED.limits;

-- 5. Helper function for atomic increments
CREATE OR REPLACE FUNCTION increment_usage(target_user_id uuid, target_feature text, current_period_start timestamp with time zone)
RETURNS void AS $$
BEGIN
    INSERT INTO usage_tracking (user_id, feature, period_start, usage_count)
    VALUES (target_user_id, target_feature, current_period_start, 1)
    ON CONFLICT (user_id, feature, period_start)
    DO UPDATE SET usage_count = usage_tracking.usage_count + 1;
END;
$$ LANGUAGE plpgsql;
