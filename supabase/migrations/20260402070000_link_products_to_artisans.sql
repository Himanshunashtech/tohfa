-- =============================================
-- LINK UNASSIGNED PRODUCTS TO ARTISANS
-- =============================================

-- 1. Link Home & Ambiance products (p29-p34, p40, p42, etc.) to Aris, Luca, Julian and Elara
UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000013' -- Aris
WHERE slug IN ('p29', 'p34', 'p40');

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000014' -- Luca
WHERE slug IN ('p30', 'p42', 'p48');

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000012' -- Julian
WHERE slug IN ('p31', 'p45', 'p50');

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000011' -- Elara
WHERE slug IN ('p32', 'p33', 'p43', 'p44');

-- 2. Link legacy named products (p1-p27) to fill up the collections
UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000013' -- Aris
WHERE slug IN ('midnight-velvet-candle', 'artisan-ceramic-mug', 'p27');

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000014' -- Luca
WHERE slug IN ('sunset-silk-scarf', 'golden-pendant-necklace', 'p20');

-- 3. Link Gourmet products to artisans
UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000012' -- Julian
WHERE category_name = 'Gourmet & Sweets' AND artisan_id IS NULL;

-- 4. Catch-all for remaining products p51-p116 (Distribute somewhat evenly)
UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000013' 
WHERE slug LIKE 'p%' AND length(slug) > 2 AND mod(right(slug, 1)::integer, 4) = 0 AND artisan_id IS NULL;

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000014' 
WHERE slug LIKE 'p%' AND length(slug) > 2 AND mod(right(slug, 1)::integer, 4) = 1 AND artisan_id IS NULL;

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000012' 
WHERE slug LIKE 'p%' AND length(slug) > 2 AND mod(right(slug, 1)::integer, 4) = 2 AND artisan_id IS NULL;

UPDATE public.products 
SET artisan_id = '00000000-0000-0000-0000-000000000011' 
WHERE slug LIKE 'p%' AND length(slug) > 2 AND mod(right(slug, 1)::integer, 4) = 3 AND artisan_id IS NULL;
