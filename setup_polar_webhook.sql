-- Migration: Configure Supabase for Polar.sh Pro/Lifetime Integrations

-- 1. Create RPC function to look up user UUID by email safely
--    This is needed because `auth.admin.listUsers` restricts looking up users by email for edge functions
--    without downloading the entire user list.
CREATE OR REPLACE FUNCTION get_user_id_by_email(email_input TEXT)
RETURNS UUID
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = email_input LIMIT 1;
$$;

-- 2. Add Lifetime Pro fields to `subscriptions` table (which is the main limit check table)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS pro_activated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS user_email TEXT;

ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_email_key UNIQUE (user_email);

-- 3. In case any future query looks for 'active' status specifically, we keep using `status` alongside `is_pro`
-- This ensures backward compatibility with `limits.ts` which checks `isPro = sub?.status === 'active'`
