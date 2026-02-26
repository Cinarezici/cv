-- Migration for Motivation Letter Short Share Links

CREATE TABLE IF NOT EXISTS public.letter_share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    letter_id UUID NOT NULL REFERENCES public.motivation_letters(id) ON DELETE CASCADE,
    owner_user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NULL,
    last_accessed_at TIMESTAMPTZ NULL
);

-- Index for fast lookup by slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_letter_share_links_slug ON public.letter_share_links(slug);

-- Enable RLS
ALTER TABLE public.letter_share_links ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can select their own links
CREATE POLICY "Users can select their own letter share links"
    ON public.letter_share_links FOR SELECT
    USING (auth.uid() = owner_user_id);

-- Policy: Owners can insert their own links
CREATE POLICY "Users can insert their own letter share links"
    ON public.letter_share_links FOR INSERT
    WITH CHECK (auth.uid() = owner_user_id);

-- Policy: Owners can update their own links
CREATE POLICY "Users can update their own letter share links"
    ON public.letter_share_links FOR UPDATE
    USING (auth.uid() = owner_user_id)
    WITH CHECK (auth.uid() = owner_user_id);

-- Policy: Owners can delete their own links
CREATE POLICY "Users can delete their own letter share links"
    ON public.letter_share_links FOR DELETE
    USING (auth.uid() = owner_user_id);

-- Note: The API /l/[slug] routes will use the Service Role key to bypass RLS,
-- ensuring that the public CANNOT query this table directly, but CAN redeem slugs securely.
