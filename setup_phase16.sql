-- ========================================================
-- Phase 16: Add theme/design columns to resumes table
-- ========================================================
-- Run this in Supabase SQL Editor ONCE

ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS theme_id          TEXT    DEFAULT 'clean-ats',
  ADD COLUMN IF NOT EXISTS theme_category    TEXT    DEFAULT 'ats_safe',
  ADD COLUMN IF NOT EXISTS color_palette_id  TEXT    DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS section_order     JSONB   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS hidden_sections   JSONB   DEFAULT NULL;
