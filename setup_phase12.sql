-- 1. Create Motivation Letters Table
CREATE TABLE IF NOT EXISTS motivation_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for motivation_letters
ALTER TABLE motivation_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own motivation letters" ON motivation_letters
  FOR ALL USING (auth.uid() = user_id);

-- 2. Modify shared_links table
-- Add columns for CV vs Motivation Letter splitting, expiration, and analytics
ALTER TABLE shared_links
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'cv' CHECK (type IN ('cv', 'motivation_letter')),
  ADD COLUMN IF NOT EXISTS motivation_letter_id UUID REFERENCES motivation_letters(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 3. Analytics table (share_events)
CREATE TABLE IF NOT EXISTS share_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shared_link_id UUID REFERENCES shared_links(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for share_events
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;

-- Users can only view analytics for links they own
CREATE POLICY "Users can view analytics for their links" ON share_events
  FOR SELECT USING (
    shared_link_id IN (SELECT id FROM shared_links WHERE user_id = auth.uid())
  );
