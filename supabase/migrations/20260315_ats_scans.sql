-- Migration: create ats_scans table for ATS Scanner feature
-- Run this in Supabase SQL Editor

create table if not exists ats_scans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    file_name text,
    overall_score integer,
    result jsonb,
    cv_text text,
    improved_cv text,
    structured_cv jsonb,
    job_description text,
    created_at timestamptz not null default now()
);

-- Index for fast user queries
create index if not exists ats_scans_user_id_idx on ats_scans(user_id);
create index if not exists ats_scans_created_at_idx on ats_scans(user_id, created_at desc);

-- RLS
alter table ats_scans enable row level security;

create policy "Users can read own ats_scans"
    on ats_scans for select
    using (auth.uid() = user_id);

create policy "Users can insert own ats_scans"
    on ats_scans for insert
    with check (auth.uid() = user_id);

create policy "Users can update own ats_scans"
    on ats_scans for update
    using (auth.uid() = user_id);
