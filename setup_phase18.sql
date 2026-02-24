-- ========================================================
-- Phase 18: Profiles Table Fix
-- Adds updated_at column to profiles for stable sorting.
-- ========================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Also ensure resumes has updated_at just in case (though it should)
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
