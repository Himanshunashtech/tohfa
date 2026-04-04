-- Add is_featured column to collections table
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Force a refresh of the schema cache (standard procedure for Supabase migrations)
COMMENT ON COLUMN public.collections.is_featured IS 'Whether this collection shows up on the home page curated section';
