-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    image_url text,
    best_for text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create collection_products junction table
CREATE TABLE IF NOT EXISTS public.collection_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(collection_id, product_id)
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

-- Policies for collections
CREATE POLICY "Public can view collections" ON public.collections
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage collections" ON public.collections
    FOR ALL USING (auth.jwt() ->> 'email' = 'himanshunashtech@gmail.com');

-- Policies for collection_products
CREATE POLICY "Public can view collection products" ON public.collection_products
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage collection products" ON public.collection_products
    FOR ALL USING (auth.jwt() ->> 'email' = 'himanshunashtech@gmail.com');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
