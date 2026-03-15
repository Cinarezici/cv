-- Add optimized_score column to ats_scans table
-- Run this in Supabase SQL Editor

alter table ats_scans add column if not exists optimized_score integer;
