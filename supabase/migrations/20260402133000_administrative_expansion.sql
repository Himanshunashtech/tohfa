-- 1. SITE CONTENT TABLE (CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. REVIEWS MODERATION STATUS (Adding to existing table)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='status') THEN
        ALTER TABLE public.reviews ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- 3. SHIPPING METHODS TABLE
CREATE TABLE IF NOT EXISTS public.shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC(10,2) DEFAULT 0,
    surcharge_fixed NUMERIC(10,2) DEFAULT 0,
    surcharge_midnight NUMERIC(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INITIAL DATA SEEDING (SAMPLES)
INSERT INTO public.site_content (section_key, content)
VALUES 
('home_hero', '{
    "title": "Elevating \\n The Art Of \\n <span class=\\"text-primary italic\\">Generosity.</span>",
    "subtitle": "TofhaVerse is where master craftsmanship meets white-glove logistics. Discover gifts that leave an enduring legacy.",
    "primaryBtnText": "Begin Curating",
    "secondaryBtnText": "Meet the Makers"
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

-- Note: store_settings already exists in types.ts, so we don't recreate it.

CREATE POLICY "Allow all for authenticated users" ON public.site_content 
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.site_settings 
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON public.shipping_methods 
    FOR ALL USING (auth.role() = 'authenticated');

-- Public select for CMS
CREATE POLICY "Allow public select for site_content" ON public.site_content 
    FOR SELECT USING (true);
