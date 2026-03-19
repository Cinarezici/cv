-- Migration for 3-tier Pricing & Trial Overhaul

-- 1. Add trial and usage limit columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS trial_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_expiry timestamp with time zone,
ADD COLUMN IF NOT EXISTS usage_cv_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_letter_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_keywords_today integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_keywords_last_reset timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS grandfathered boolean DEFAULT false;

-- 2. Create a function to auto-reset keywords based on local date change (optional usage)
CREATE OR REPLACE FUNCTION check_and_reset_daily_keywords()
RETURNS TRIGGER AS $$
BEGIN
  -- If we are updating usage_keywords_today and it's a new calendar day
  IF (NEW.usage_keywords_last_reset::date < now()::date) THEN
    NEW.usage_keywords_today := 0;
    NEW.usage_keywords_last_reset := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger for subscriptions to automatically reset
DROP TRIGGER IF EXISTS reset_daily_keywords_trg ON subscriptions;
CREATE TRIGGER reset_daily_keywords_trg
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION check_and_reset_daily_keywords();
