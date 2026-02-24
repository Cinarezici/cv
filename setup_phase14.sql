-- Phase 14: Saved Jobs (Favori İlanlar) Table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  source_id TEXT NOT NULL,                  -- APify or generic Source ID to prevent duplicates
  job_data JSONB NOT NULL,                  -- The entire Job object (title, companyName, descriptionText, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent same user saving the exact same job twice
  UNIQUE(user_id, source_id)
);

-- RLS for saved_jobs
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = user_id);

-- Indices
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_source ON saved_jobs(source_id);
