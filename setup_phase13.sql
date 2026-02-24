-- 1. Create CVs Table (Manual Editor)
CREATE TABLE IF NOT EXISTS cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Resume',
  resume_json JSONB NOT NULL DEFAULT '{}',
  theme_id TEXT NOT NULL DEFAULT 'clean-ats',
  theme_category TEXT CHECK (theme_category IN ('ats_safe', 'visual')) DEFAULT 'ats_safe',
  color_palette_id TEXT DEFAULT 'default',
  section_order JSONB DEFAULT '["header","summary","skills","experience","education","projects","certifications","languages","additional"]',
  hidden_sections JSONB DEFAULT '[]',
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for cvs
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own CVs" ON cvs
  FOR ALL USING (auth.uid() = user_id);

-- Index for cvs
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_updated_at ON cvs(updated_at DESC);

-- 2. Create Company Profiles Table (Cache for Apify Scrapes)
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Company Identity
  company_name TEXT NOT NULL,
  company_url TEXT,                        -- e.g., "https://trendyol.com"
  company_domain TEXT,                     -- e.g., "trendyol.com" (normalized)
  
  -- Research Data (Raw + Structured from Apify/AI)
  raw_scraped_text TEXT,                   -- Raw scraped markdown/text
  structured_profile JSONB NOT NULL,       -- Parsed CompanyProfile JSON object
  
  -- Metadata & Tracking
  scrape_status TEXT CHECK (scrape_status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  apify_run_id TEXT,                       -- Apify run ID for polling
  apify_dataset_id TEXT,                   -- Apify dataset ID
  scrape_error TEXT,                       -- Error message if failed
  
  -- Cache Control
  scraped_at TIMESTAMPTZ,
  cache_expires_at TIMESTAMPTZ,            -- Usually scraped_at + 24 hours
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_company_profiles_domain ON company_profiles(company_domain);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user ON company_profiles(user_id);

-- RLS for company_profiles
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own company profiles" ON company_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 3. Create Motivation Letters Table
-- Drop old constraint if motivation_letters existed in phase 12
-- We will replace or modify it as needed. If it's totally new, this works fine.
-- Note: Assuming motivation_letters from Phase 12 isn't fully built or we are overriding.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'motivation_letters') THEN
        CREATE TABLE motivation_letters (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            
            -- Relations
            company_profile_id UUID REFERENCES company_profiles(id),
            cv_id UUID REFERENCES cvs(id),           -- The base CV used
            
            -- Letter Content
            company_name TEXT NOT NULL,
            target_role TEXT,                        -- e.g., "Senior Product Manager"
            tone TEXT CHECK (tone IN ('corporate', 'startup', 'friendly_formal', 'executive')) DEFAULT 'corporate',
            letter_text TEXT NOT NULL,               -- Plain text
            letter_html TEXT NOT NULL,               -- Rendered HTML
            
            -- PDF Storage
            pdf_storage_path TEXT,                   -- Supabase storage path
            pdf_url TEXT,                            -- Signed URL
            pdf_filename TEXT,                       
            pdf_template_id TEXT DEFAULT 'modern',   -- Used template
            pdf_generated_at TIMESTAMPTZ,
            
            -- Sharing
            share_token TEXT UNIQUE,                 -- UUID based secret token
            share_url TEXT,                          -- "app.com/letter/share/{share_token}"
            is_public BOOLEAN DEFAULT FALSE,
            share_expires_at TIMESTAMPTZ,            -- Free: +7 days, Pro: null
            
            -- Status
            generation_status TEXT CHECK (generation_status IN ('pending', 'researching', 'generating', 'creating_pdf', 'completed', 'failed')) DEFAULT 'pending',
            generation_error TEXT,
            
            -- Batch
            batch_id TEXT,                           -- Grouping ID for multi-company creation
            
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Indices
        CREATE INDEX IF NOT EXISTS idx_motivation_letters_user ON motivation_letters(user_id);
        CREATE INDEX IF NOT EXISTS idx_motivation_letters_company ON motivation_letters(company_name);
        CREATE INDEX IF NOT EXISTS idx_motivation_letters_status ON motivation_letters(generation_status);
        CREATE INDEX IF NOT EXISTS idx_motivation_letters_batch ON motivation_letters(batch_id);
        CREATE INDEX IF NOT EXISTS idx_motivation_letters_share_token ON motivation_letters(share_token);

        -- RLS
        ALTER TABLE motivation_letters ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users manage own letters" ON motivation_letters
        FOR ALL USING (auth.uid() = user_id);
        
        CREATE POLICY "Anyone can view public letters via token" ON motivation_letters
        FOR SELECT USING (
            is_public = TRUE AND share_token IS NOT NULL
            AND (share_expires_at IS NULL OR share_expires_at > NOW())
        );
    ELSE
        -- If it exists from phase 12, just alter it to add the new phase 13 columns
        ALTER TABLE motivation_letters
          ADD COLUMN IF NOT EXISTS company_profile_id UUID REFERENCES company_profiles(id),
          ADD COLUMN IF NOT EXISTS cv_id UUID REFERENCES cvs(id),
          ADD COLUMN IF NOT EXISTS tone TEXT CHECK (tone IN ('corporate', 'startup', 'friendly_formal', 'executive')) DEFAULT 'corporate',
          ADD COLUMN IF NOT EXISTS letter_html TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS pdf_storage_path TEXT,
          ADD COLUMN IF NOT EXISTS pdf_url TEXT,
          ADD COLUMN IF NOT EXISTS pdf_filename TEXT,
          ADD COLUMN IF NOT EXISTS pdf_template_id TEXT DEFAULT 'modern',
          ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
          ADD COLUMN IF NOT EXISTS share_url TEXT,
          ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS share_expires_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS generation_status TEXT CHECK (generation_status IN ('pending', 'researching', 'generating', 'creating_pdf', 'completed', 'failed')) DEFAULT 'completed',
          ADD COLUMN IF NOT EXISTS generation_error TEXT,
          ADD COLUMN IF NOT EXISTS batch_id TEXT;
          
        CREATE POLICY "Anyone can view public letters via token Phase13" ON motivation_letters
        FOR SELECT USING (
            is_public = TRUE AND share_token IS NOT NULL
            AND (share_expires_at IS NULL OR share_expires_at > NOW())
        );
    END IF;
END $$;
