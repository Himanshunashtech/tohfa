-- Seed Collections
INSERT INTO public.collections (name, slug, description, image_url, best_for) VALUES
('The Signature Box', 'signature', 'Our flagship curation of premium goods — hand-picked by the Tofhaverse team for the ultimate impression.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop', 'Corporate Gifting & VIPs'),
('The Obsidian Series', 'obsidian', 'Forged in the shadows of volcanic power. A minimalist suite of desk essentials and home accents for the modern architect.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop', 'Minimalist Professionals'),
('Holiday Warmth', 'holiday', 'Festive favorites wrapped in joy. Everything they need for a cozy, magical season.', 'https://images.unsplash.com/photo-1545601445-4d6a0a056a07?q=80&w=2000&auto=format&fit=crop', 'Seasonal Gifting'),
('Indigo Heritage', 'indigo', 'Capturing the deep, meditative blues of artisanal craft. From Murano mist to hand-dyed silks, a celebration of heritage in hue.', 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2000&auto=format&fit=crop', 'Heritage Item Lovers'),
('Self-Care Sanctuary', 'self-care', 'A curated escape for the senses — candles, botanicals, and serenity in every detail.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop', 'Wellness & Relaxation'),
('Wellness Rituals', 'wellness', 'A sensory journey into tranquility. Curated botanicals and architectural burners designed to transform any space into a sanctuary.', 'https://images.unsplash.com/photo-1540924127163-952467b717d2?q=80&w=2000&auto=format&fit=crop', 'Mindful Living'),
('Gourmet Indulgence', 'gourmet', 'For the culinary curious — artisan flavors and fine ingredients, beautifully presented.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop', 'Foodies & Hosts')
ON CONFLICT (slug) DO NOTHING;

-- Link Products (Signature)
INSERT INTO public.collection_products (collection_id, product_id)
SELECT c.id, p.id FROM public.collections c, public.products p 
WHERE c.slug = 'signature' AND p.slug IN ('midnight-velvet-candle', 'artisan-truffle-collection', 'golden-pendant-necklace', 'sunset-silk-scarf')
ON CONFLICT DO NOTHING;

-- Link Products (Obsidian)
INSERT INTO public.collection_products (collection_id, product_id)
SELECT c.id, p.id FROM public.collections c, public.products p 
WHERE c.slug = 'obsidian' AND p.slug IN ('obsidian-desk-set', 'midnight-velvet-candle', 'heritage-timepiece', 'amethyst-bookends')
ON CONFLICT DO NOTHING;

-- Link Products (Self-care)
INSERT INTO public.collection_products (collection_id, product_id)
SELECT c.id, p.id FROM public.collections c, public.products p 
WHERE c.slug = 'self-care' AND p.slug IN ('midnight-velvet-candle', 'zen-essential-diffuser', 'botanical-soap-collection', 'living-succulent-gift')
ON CONFLICT DO NOTHING;

-- Link more products to hit 10-15 per collection where possible
-- (Assuming more products exist in the store)
INSERT INTO public.collection_products (collection_id, product_id)
SELECT c.id, p.id FROM public.collections c, public.products p 
WHERE c.slug = 'signature' AND p.slug NOT IN ('midnight-velvet-candle', 'artisan-truffle-collection', 'golden-pendant-necklace', 'sunset-silk-scarf')
LIMIT 6;

INSERT INTO public.collection_products (collection_id, product_id)
SELECT c.id, p.id FROM public.collections c, public.products p 
WHERE c.slug = 'obsidian' AND p.slug NOT IN ('obsidian-desk-set', 'midnight-velvet-candle', 'heritage-timepiece', 'amethyst-bookends')
LIMIT 8;
