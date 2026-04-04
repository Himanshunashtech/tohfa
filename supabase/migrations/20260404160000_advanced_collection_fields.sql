-- Add advanced management fields to collections table
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' CHECK (status IN ('published', 'draft')),
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Comment for schema visibility
COMMENT ON COLUMN public.collections.status IS 'The publishing status of the collection. Only published collections are shown to customers.';
COMMENT ON COLUMN public.collections.metadata IS 'Custom theme or layout configuration for the collection detail page.';
