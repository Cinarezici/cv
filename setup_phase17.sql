-- ========================================================
-- Phase 17: Job Search (Scout) Logs
-- Tracks user search activity to enforce daily limits.
-- ========================================================

CREATE TABLE IF NOT EXISTS scout_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query        TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_scout_logs_user       ON scout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_scout_logs_created_at ON scout_logs(created_at);

-- RLS — owners can manage their own logs; 
ALTER TABLE scout_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own scout logs" ON scout_logs;

CREATE POLICY "Users can manage their own scout logs"
  ON scout_logs FOR ALL
  USING (auth.uid() = user_id);

-- Explicitly grant access
GRANT ALL ON scout_logs TO authenticated;
GRANT ALL ON scout_logs TO service_role;
