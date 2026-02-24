-- ========================================================
-- Phase 15: Protected CV Share Links
-- Creates cv_share_links table for the /cv/[shareId] system
-- ========================================================

-- 1. cv_share_links table
-- Maps a public shareId (UUID) → a specific resume owned by a user.
-- Access is always verified server-side before any CV data is returned.

CREATE TABLE IF NOT EXISTS cv_share_links (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- = shareId in the URL
  resume_id        UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  owner_user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_cv_share_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cv_share_links_updated_at ON cv_share_links;
CREATE TRIGGER trg_cv_share_links_updated_at
  BEFORE UPDATE ON cv_share_links
  FOR EACH ROW EXECUTE FUNCTION update_cv_share_links_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cv_share_links_owner  ON cv_share_links(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_cv_share_links_resume ON cv_share_links(resume_id);

-- RLS — owners can manage their own links; public read happens via service role
ALTER TABLE cv_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage their cv share links"
  ON cv_share_links FOR ALL
  USING (auth.uid() = owner_user_id);

-- ========================================================
-- 2. Grant necessary access
-- ========================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON cv_share_links TO authenticated;
GRANT SELECT ON cv_share_links TO service_role;
