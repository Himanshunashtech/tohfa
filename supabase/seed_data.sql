-- =============================================
-- TOFHAVERSE DATA SEED (REVISED)
-- =============================================

-- 1. SEED CATEGORIES
-- Using ON CONFLICT (name) to avoid duplicates if the category already exists
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES 
    (gen_random_uuid(), 'Home & Ambiance', 'home-ambiance', 'Handcrafted decor and atmospheric essentials.', 1),
    (gen_random_uuid(), 'Gourmet & Sweets', 'gourmet-sweets', 'Exquisite flavors and artisanal treats.', 2),
    (gen_random_uuid(), 'Jewelry & Accessories', 'jewelry-accessories', 'Timeless pieces and modern wearables.', 3),
    (gen_random_uuid(), 'Plants & Green Living', 'plants-green-living', 'Nature-inspired gifts that grow.', 4),
    (gen_random_uuid(), 'Bath & Wellness', 'bath-wellness', 'Self-care rituals and botanical luxury.', 5),
    (gen_random_uuid(), 'Stationery & Books', 'stationery-books', 'Tools for creative expression and memories.', 6)
ON CONFLICT (name) DO NOTHING;

-- 1.1 STORAGE BUCKETS
-- Ensure the bucket for product images exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: Policies are typically handled in migrations, but we ensure basic visibility here if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Uploads'
    ) THEN
        CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Updates'
    ) THEN
        CREATE POLICY "Public Updates" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
    END IF;
END $$;

-- 2. SEED ARTISANS
-- Using fixed IDs and handling both ID and slug conflicts
INSERT INTO public.artisans (id, name, slug, role, location, bio, photo, active, rating, products_count)
VALUES 
    ('00000000-0000-0000-0000-000000000011', 'Elara Vance', 'elara-vance', 'Master Chandler', 'Grasse, France', 'Elara has spent 15 years perfecting the science of scent, ensuring every pour is a spiritual experience.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop', true, 5.0, 12),
    ('00000000-0000-0000-0000-000000000012', 'Julian Kross', 'julian-kross', 'Geological Craftsman', 'Reykjavik, Iceland', 'Julian works exclusively with volcanic materials, bridging the gap between raw earth and refined luxury.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop', true, 4.9, 8),
    ('00000000-0000-0000-0000-000000000013', 'Aris', 'aris-master', 'Heritage Woodworker', 'Ubud, Bali', 'A third-generation woodworker specializing in rescuing teak from heritage buildings and transforming it into functional art.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop', true, 5.0, 15),
    ('00000000-0000-0000-0000-000000000014', 'Luca', 'luca-glass', 'Murano Glass Maestro', 'Venice, Italy', 'Luca trained under the legendary maestros of Murano before establishing his own sustainable kiln that uses recycled glass fragments.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop', true, 5.0, 7)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    role = EXCLUDED.role,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo = EXCLUDED.photo;

-- 3. SEED PRODUCTS
-- Using subqueries to get category IDs safely and handling slug conflicts
INSERT INTO public.products (id, name, slug, price, category_name, category_id, artisan_id, short_desc, description, images, stock, rating, review_count, is_best_seller, is_new_arrival)
VALUES 
    (
        gen_random_uuid(), 
        'The Midnight Velvet Candle', 
        'midnight-velvet-candle-seed', 
        48.00, 
        'Home & Ambiance',
        (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1),
        '00000000-0000-0000-0000-000000000011',
        'Hand-poured soy candle with notes of cedar, vanilla, and a whisper of smoked leather.',
        'Transform any room into a sanctuary with our signature Midnight Velvet Candle. Hand-poured in small batches using 100% natural soy wax.',
        ARRAY['https://images.unsplash.com/photo-1521193089946-7aa29d1fe331?w=800'],
        100, 5.0, 124, true, false
    ),
    (
        gen_random_uuid(), 
        'The Obsidian Executive Set', 
        'obsidian-executive-set-seed', 
        350.00, 
        'Home & Ambiance',
        (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1),
        '00000000-0000-0000-0000-000000000012',
        'A master-crafted obsidian desk set for the modern professional.',
        'Elevate any professional workspace with this heavy obsidian desk set. Each piece is hand-polished to a mirror finish.',
        ARRAY['https://images.unsplash.com/photo-1595914480838-8959eb4482c3?w=800'],
        50, 4.9, 15, false, true
    ),
    (
        gen_random_uuid(), 
        'Teak & Terrazzo Serving Platter', 
        'teak-terrazzo-platter-seed', 
        185.00, 
        'Home & Ambiance',
        (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1),
        '00000000-0000-0000-0000-000000000013',
        'A contemporary fusion of reclaimed teak wood and sustainably sourced terrazzo.',
        'Each platter is hand-poured and polished by artisans in the TofhaVerse coastal workshop.',
        ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
        75, 4.8, 42, false, false
    ),
    (
        gen_random_uuid(), 
        'Iridescent Murano Swirl Vase', 
        'murano-swirl-vase-seed', 
        340.00, 
        'Home & Ambiance',
        (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1),
        '00000000-0000-0000-0000-000000000014',
        'Hand-blown Venetian glass with shifting iridescence.',
        'Capturing the fluid motion of Venetian canals, this hand-blown glass vase features an iridescent finish.',
        ARRAY['https://images.unsplash.com/photo-1504107819100-db0e9678a7bc?w=800'],
        20, 5.0, 18, true, true
    )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED STORE SETTINGS
INSERT INTO public.store_settings (id, store_name, email, currency, timezone, settings_json)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'TofhaVerse Global', 'ops@tofhaverse.com', 'USD', 'UTC-8', '{"tax_rate": 0.08, "shipping_flat_rate": 15.00}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED LOYALTY SETTINGS
INSERT INTO public.loyalty_settings (id, points_per_dollar, tier_thresholds, redemption_options)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 1, '{"silver": 1000, "gold": 5000, "platinum": 10000}'::jsonb, '[{"name": "$10 Discount", "points": 500}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6. BULK PRODUCT MIGRATION (p29-p116)
-- Mapping mock IDs to the 'slug' field for URL compatibility
INSERT INTO public.products (name, slug, price, category_name, category_id, short_desc, description, images, stock, rating, review_count, is_best_seller, is_new_arrival)
VALUES
    ('Sculpted Teak Book Ledge', 'p29', 320.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Floating ledge from single slabs of aged teak.', 'A wall-mounted display ledge hand-sculpted from single slabs of aged teak root. Hidden floating mounting system included.', ARRAY['product-images/p29.jpg'], 100, 4.8, 15, false, true),
    ('Quartz Meditation Bowl', 'p30', 280.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Milled from single blocks of clear frosted quartz.', 'Milled from a single solid block of clear quartz and frosted on the exterior for a soft light diffusion. A meditative focal point for home interiors.', ARRAY['product-images/p30.jpg'], 100, 4.9, 19, false, false),
    ('Botanical Copper Watering Can', 'p31', 135.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Solid copper can with gooseneck spout.', 'Heritage-grade garden luxury. Solid copper watering can with a precision gooseneck spout for delicate indoor plant care.', ARRAY['product-images/p31.jpg'], 100, 4.7, 45, false, false),
    ('Alpine Fir & Smoked Oud Candle', 'p32', 68.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Heavy glass vessel with forest botanical scent.', 'A scent journey into the deep forest. Crushed pine needles, damp earth, and heavy smoked wood notes. Heavyweight reusable glass vessel.', ARRAY['product-images/p32.jpg'], 100, 4.7, 88, false, false),
    ('Silverbark Incense Collection', 'p33', 45.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Rare silverbark and aged patchouli charcoal sticks.', 'Premium charcoal incense infused with rare silverbark balsam and aged patchouli. Hand-rolled using five-generation kyoto techniques.', ARRAY['product-images/p33.jpg'], 100, 4.9, 112, false, false),
    ('Bronze & Leather Log Holder', 'p34', 480.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Hand-forged bronze frame with suede sling.', 'A sculptural solution for the hearth. Hand-forged bronze frame with a heavy-duty distressed suede sling for log storage.', ARRAY['product-images/p34.jpg'], 100, 4.8, 12, false, false),
    ('Wildflower Raw Honey Vault', 'p35', 125.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Three rare single-origin honeys in a cedar chest.', 'A triptych of rare, unfiltered raw honeys from the world''s most remote ecosystems. Includes Himalayan White Honey, Tasmanian Leatherwood, and Brazilian Rainforest jar.', ARRAY['product-images/p35.jpg'], 100, 5.0, 38, true, false),
    ('Truffle Infusion Laboratory', 'p36', 180.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Black truffle oil, salt, and raw honey infusion set.', 'Elevate any culinary creation with the world''s most aromatic fungus. This set includes a triple-concentrated black truffle oil, Mediterranean sea salt infusion, and truffle honey.', ARRAY['product-images/p36.jpg'], 100, 4.9, 14, false, false),
    ('Aizome Indigo Silk Pocket Square', 'p37', 65.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Hand-rolled silk dyed with natural indigo.', 'A burst of ancient color for the modern suit. Each pocket square is hand-rolled and dyed in authentic Japanese indigo vats, resulting in a deep, living blue.', ARRAY['product-images/p37.jpg'], 100, 4.8, 22, false, false),
    ('Sterling Silver Hammered Bangle', 'p38', 285.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Hand-smithed solid silver with faceted texture.', 'A heavy-gauge solid 925 sterling silver bangle, hand-hammered to create a signature light-catching faceted texture. Minimalist and timeless.', ARRAY['product-images/p38.jpg'], 100, 5.0, 31, true, false),
    ('Midnight Oud & Leather Parfum', 'p39', 165.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Concentrated extract of dark oud and smokey hide.', 'A potent, unisex scent for the bold. Notes of aged agarwood (oud), raw leather, saffron, and a hint of dark raspberry. High oil concentration for 12-hour silage.', ARRAY['product-images/p39.jpg'], 100, 4.9, 52, false, false),
    ('Copper & Glass Pour-Over Stand', 'p40', 215.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Precision copper frame for manual coffee brewing.', 'The ultimate ritual tool for the coffee purist. A hand-forged copper arm supports a thick borosilicate glass dripper for the perfect morning brew.', ARRAY['product-images/p40.jpg'], 100, 4.7, 18, false, false),
    ('Hand-Bound Linen Travel Log', 'p41', 85.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Italian linen bound journal with heavyweight paper.', 'Designed for the modern voyager. A hand-bound journal covered in raw stonewashed linen, containing 160 pages of fountain-pen-friendly cream paper.', ARRAY['product-images/p41.jpg'], 100, 4.9, 65, false, false),
    ('Reclaimed Brass Pillar Stand', 'p42', 145.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Architectural candle holder from industrial brass.', 'A heavy, sculptural pillar stand milled from a single block of industrial brass reclaimed from decommissioned maritime equipment. High-polish finish.', ARRAY['product-images/p42.jpg'], 100, 4.8, 27, false, false),
    ('Botanical Cyanotype Art Print', 'p43', 110.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Original sun-printed art on deckled edge paper.', 'An original cyanotype print created by exposing sun-sensitive paper to the midday light. Featuring foraged ferns and wildflowers from the TofhaVerse gardens.', ARRAY['product-images/p43.jpg'], 100, 4.6, 12, false, false),
    ('Tumbled Sea Glass Chime', 'p44', 75.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Hand-strung beach glass with driftwood anchor.', 'The sound of the ocean, captured. This wind chime features frosted sea glass collected from the Pacific coast, strung on durable silk cord with driftwood.', ARRAY['product-images/p44.jpg'], 100, 4.9, 44, false, false),
    ('Marble & Mirror Chess Set', 'p45', 450.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Contemporary chess with black and white marble.', 'A monumental game for the discerning home. Heavyweight blocks of Nero Marquina and Carrara marble form a minimalist chess set of exceptional elegance.', ARRAY['product-images/p45.jpg'], 100, 5.0, 7, true, false),
    ('Eucalyptus & Peppermint Spa Set', 'p46', 135.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Revitalizing home spa set with organic oils.', 'Transform the morning ritual into a restorative escape. Includes botanical shower mist, heavyweight waffle robe, and volcanic pumice stone.', ARRAY['product-images/p46.jpg'], 100, 4.8, 92, false, false),
    ('Hand-Loomed Silk Eye Mask', 'p47', 55.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Padded raw silk for total light-block sleep.', 'The ultimate sleep accessory. Hand-loomed raw silk padded with organic lavender-infused down for a soothing weight across the eyes.', ARRAY['product-images/p47.jpg'], 100, 4.7, 156, false, false),
    ('Bronze Artisan Keycap Set', 'p48', 210.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Luxury mechanical keyboard set in solid bronze.', 'For the elite workspace. Precision-cast and hand-polished escape and functions keys made from solid architectural bronze. Tactical art for the desk.', ARRAY['product-images/p48.jpg'], 100, 5.0, 19, false, true),
    ('Rare Saffron Negin Vault', 'p49', 185.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Grade-A Persian saffron in a velvet display case.', 'The Red Gold of the culinary world. 5 grams of Grade-A Negin saffron, hand-harvested and vacuum-sealed to preserve purity. Includes precision tweezers.', ARRAY['product-images/p49.jpg'], 100, 5.0, 22, false, false),
    ('Architectural Wine Aerator', 'p50', 245.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Milled aluminum aerator with crystal insert.', 'Elegance in aeration. A precision-milled aluminum stand with a custom lead-free crystal funnel designed for optimal oxygenation of fine wines.', ARRAY['product-images/p50.jpg'], 100, 4.8, 45, false, false),
    ('Artisan Gift P51', 'p51', 128.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'A handcrafted masterpiece for your living space.', 'Elegant and functional, this piece is part of our heritage collection.', ARRAY['product-images/p51.jpg'], 50, 4.8, 32, false, true),
    ('Artisan Gift P52', 'p52', 85.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Indulge in artisanal flavors and textures.', 'Sourced from the finest ingredients, this gift is a treat for the senses.', ARRAY['product-images/p52.jpg'], 45, 4.9, 41, false, false),
    ('Artisan Gift P53', 'p53', 155.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Timeless accessory with modern flair.', 'Designed for everyday elegance, this piece complements any style.', ARRAY['product-images/p53.jpg'], 30, 4.7, 18, false, false),
    ('Artisan Gift P54', 'p54', 45.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Bringing nature''s serenity indoors.', 'Low-maintenance and beautifully presented, it''s a gift that grows.', ARRAY['product-images/p54.jpg'], 80, 4.8, 62, false, false),
    ('Artisan Gift P55', 'p55', 195.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'A statement piece for the modern interior.', 'Hand-sculpted and polished, this item captures the essence of luxury.', ARRAY['product-images/p55.jpg'], 20, 5.0, 12, true, false),
    ('Artisan Gift P56', 'p56', 72.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Revitalize your routine with artisan care.', 'Infused with botanical extracts for a premium spa-like experience.', ARRAY['product-images/p56.jpg'], 120, 4.6, 88, false, false),
    ('Artisan Gift P57', 'p57', 58.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Classic tools for creative expressions.', 'Premium materials meet traditional craftsmanship for lasting use.', ARRAY['product-images/p57.jpg'], 65, 4.9, 54, false, false),
    ('Artisan Gift P58', 'p58', 210.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Sophisticated elegance in every detail.', 'A luxury accessory that makes a bold statement.', ARRAY['product-images/p58.jpg'], 15, 4.8, 22, false, false),
    ('Artisan Gift P59', 'p59', 98.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Functional art for the everyday home.', 'Individually crafted to ensure unique variations and character.', ARRAY['product-images/p59.jpg'], 40, 4.7, 45, false, false),
    ('Artisan Gift P60', 'p60', 135.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Fine culinary delights for the connoisseur.', 'A curated collection of flavors from around the world.', ARRAY['product-images/p60.jpg'], 25, 5.0, 19, false, false),
    ('Artisan Gift P61', 'p61', 42.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Low-maintenance beauty for any space.', 'A perfect gift for those who love green living with ease.', ARRAY['product-images/p61.jpg'], 90, 4.5, 112, false, false),
    ('Artisan Gift P62', 'p62', 180.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Architectural elegance in home decor.', 'Milled from premium materials for a weighted, quality feel.', ARRAY['product-images/p62.jpg'], 12, 4.9, 33, false, false),
    ('Artisan Gift P63', 'p63', 64.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Renew your spirit with botanical luxury.', 'Carefully formulated with natural oils for lasting hydration.', ARRAY['product-images/p63.jpg'], 110, 4.8, 76, false, false),
    ('Artisan Gift P64', 'p64', 48.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'The perfect companion for your daily thoughts.', 'Lay-flat design and premium paper for effortless writing.', ARRAY['product-images/p64.jpg'], 75, 4.7, 42, false, false),
    ('Artisan Gift P65', 'p65', 220.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'A timeless masterpiece of craftsmanship.', 'Each piece is unique, telling a story of heritage and art.', ARRAY['product-images/p65.jpg'], 10, 5.0, 8, true, false),
    ('Artisan Gift P66', 'p66', 95.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Atmospheric beauty for your evening space.', 'Captures the soft light and creates a tranquil atmosphere.', ARRAY['product-images/p66.jpg'], 35, 4.8, 28, false, false),
    ('Artisan Gift P67', 'p67', 115.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Gourmet treasures for a refined palate.', 'Artisan-made treats that celebrate traditional recipes.', ARRAY['product-images/p67.jpg'], 28, 4.9, 15, false, false),
    ('Artisan Gift P68', 'p68', 78.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Eco-friendly living with style.', 'Sustainable choices for a beautiful and mindful home.', ARRAY['product-images/p68.jpg'], 60, 4.7, 51, false, false),
    ('Artisan Gift P69', 'p69', 145.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'A conversation piece for any room.', 'Blends industrial design with organic textures for a unique look.', ARRAY['product-images/p69.jpg'], 18, 4.6, 14, false, false),
    ('Artisan Gift P70', 'p70', 38.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Simple luxuries for a better day.', 'Gentle on the skin and kind to the earth.', ARRAY['product-images/p70.jpg'], 150, 4.9, 205, false, false),
    ('Artisan Gift P71', 'p71', 165.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Exquisite details, timeless beauty.', 'A piece that celebrates the art of handmade jewelry.', ARRAY['product-images/p71.jpg'], 22, 5.0, 11, false, false),
    ('Artisan Gift P72', 'p72', 88.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Modern essentials for the thoughtful home.', 'Combines utility with a clean, contemporary aesthetic.', ARRAY['product-images/p72.jpg'], 55, 4.8, 47, false, false),
    ('Artisan Gift P73', 'p73', 52.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Organize your life with artisan style.', 'Thoughtfully designed to inspire creativity and focus.', ARRAY['product-images/p73.jpg'], 95, 4.7, 63, false, false),
    ('Artisan Gift P74', 'p74', 125.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Sweet indulgences for special moments.', 'Hand-finished confections that make any occasion sweeter.', ARRAY['product-images/p74.jpg'], 38, 4.9, 24, false, false),
    ('Artisan Gift P75', 'p75', 240.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'The ultimate statement of artisan luxury.', 'A rare find that brings character and history to your home.', ARRAY['product-images/p75.jpg'], 5, 5.0, 6, true, false),
    ('Artisan Gift P76', 'p76', 132.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Timeless lighting for a cozy atmosphere.', 'Crafted with precision to enhance your home''s natural glow.', ARRAY['product-images/p76.jpg'], 42, 4.8, 39, false, false),
    ('Artisan Gift P78', 'p78', 95.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Rare treats for the discerning palate.', 'A selection of world-class flavors delivered in style.', ARRAY['product-images/p78.jpg'], 30, 4.9, 22, false, false),
    ('Artisan Gift P79', 'p79', 45.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Essential care for modern living.', 'Pure ingredients for a refreshing daily ritual.', ARRAY['product-images/p79.jpg'], 85, 4.7, 115, false, false),
    ('Artisan Gift P80', 'p80', 158.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Craftsmanship that shines through.', 'Elegant lines and premium materials for a lifetime of wear.', ARRAY['product-images/p80.jpg'], 18, 5.0, 12, false, false),
    ('Artisan Gift P81', 'p81', 64.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Classic stationery for modern thinkers.', 'Beautifully bound and ready for your most creative ideas.', ARRAY['product-images/p81.jpg'], 70, 4.8, 56, false, false),
    ('Artisan Gift P82', 'p82', 110.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Minimalist decor for the refined home.', 'Quiet elegance that matches any interior style.', ARRAY['product-images/p82.jpg'], 45, 4.6, 28, false, false),
    ('Artisan Gift P83', 'p83', 32.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Small delights with big flavor.', 'Hand-crafted treats that celebrate artisanal traditions.', ARRAY['product-images/p83.jpg'], 200, 4.9, 198, false, false),
    ('Artisan Gift P84', 'p84', 175.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Bespoke beauty, individually crafted.', 'A statement piece that reflects your unique style.', ARRAY['product-images/p84.jpg'], 12, 5.0, 9, false, false),
    ('Artisan Gift P85', 'p85', 52.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Living art for your sanctuary.', 'Carefully selected and potted for easy, green enjoyment.', ARRAY['product-images/p85.jpg'], 65, 4.7, 82, false, false),
    ('Artisan Gift P86', 'p86', 145.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Elevate your space with artisan light.', 'Hand-cast and finished for a unique architectural look.', ARRAY['product-images/p86.jpg'], 25, 4.8, 31, false, false),
    ('Artisan Gift P87', 'p87', 38.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Mindful care for your daily escape.', 'Infused with calming botanicals for a peaceful moment.', ARRAY['product-images/p87.jpg'], 180, 4.5, 142, false, false),
    ('Artisan Gift P88', 'p88', 68.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Record your travels and thoughts.', 'Durable and elegant, designed for a lifetime of memories.', ARRAY['product-images/p88.jpg'], 55, 4.9, 52, false, false),
    ('Artisan Gift P89', 'p89', 195.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'A masterwork of jewelry design.', 'Reflects the heritage of artisan smithing in every curve.', ARRAY['product-images/p89.jpg'], 8, 5.0, 15, true, false),
    ('Artisan Gift P90', 'p90', 125.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Symmetry and style for your home library.', 'Hand-polished stones that serve as both art and function.', ARRAY['product-images/p90.jpg'], 32, 4.7, 44, false, false),
    ('Artisan Gift P91', 'p91', 48.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Sweet treats with a gourmet twist.', 'Unique flavor profiles crafted by master confectioners.', ARRAY['product-images/p91.jpg'], 120, 4.8, 76, false, false),
    ('Artisan Gift P92', 'p92', 135.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Complete wellness set for the home spa.', 'Includes everything needed for total rejuvenation.', ARRAY['product-images/p92.jpg'], 45, 4.9, 38, false, false),
    ('Artisan Gift P94', 'p94', 72.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Breathe life into your desktop.', 'Minimalist plant display for a more vibrant workspace.', ARRAY['product-images/p94.jpg'], 80, 4.7, 65, false, false),
    ('Artisan Gift P95', 'p95', 210.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Large format art for the modern collector.', 'A monumental piece that anchors any high-end interior.', ARRAY['product-images/p95.jpg'], 10, 5.0, 14, false, false),
    ('Artisan Gift P96', 'p96', 55.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Inspire your next great idea.', 'Refined paper and binding for the serious writer.', ARRAY['product-images/p96.jpg'], 110, 4.8, 92, false, false),
    ('Artisan Gift P97', 'p97', 185.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Sophistication in every facet.', 'Hand-finished to capture light from every angle.', ARRAY['product-images/p97.jpg'], 15, 4.9, 22, false, false),
    ('Artisan Gift P98', 'p98', 82.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Warmth and style for your retreat.', 'Individually hand-dyed to capture organic color shifts.', ARRAY['product-images/p98.jpg'], 48, 4.7, 54, false, false),
    ('Artisan Gift P99', 'p99', 125.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Culinary excellence delivered.', 'A celebration of global flavors for the ultimate foodie.', ARRAY['product-images/p99.jpg'], 36, 5.0, 19, false, false),
    ('Artisan Gift P100', 'p100', 155.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'A century of artisan heritage.', 'Celebrating our 100th design with a timeless classic.', ARRAY['product-images/p100.jpg'], 20, 4.9, 27, false, false),
    ('Artisan Gift P101', 'p101', 68.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Renew your daily ritual.', 'Clean, conscious, and effective artisan care.', ARRAY['product-images/p101.jpg'], 95, 4.8, 88, false, false),
    ('Artisan Gift P102', 'p102', 245.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'A monumental work of modern design.', 'Blends industrial power with organic grace.', ARRAY['product-images/p102.jpg'], 8, 5.0, 12, false, false),
    ('Artisan Gift P103', 'p103', 92.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Elegant accents for the everyday.', 'Reflects the light and adds a touch of sophistication.', ARRAY['product-images/p103.jpg'], 60, 4.7, 45, false, false),
    ('Artisan Gift P104', 'p104', 45.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'The ultimate notebook for thinkers.', 'Pure, high-quality paper for your best ideas.', ARRAY['product-images/p104.jpg'], 130, 4.8, 112, false, false),
    ('Artisan Gift P105', 'p105', 135.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Tactile beauty for your lounge.', 'Hand-woven from sustainable wool for a rich, textured feel.', ARRAY['product-images/p105.jpg'], 35, 4.9, 33, false, false),
    ('Artisan Gift P106', 'p106', 78.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Rare treats from small plots.', 'Indulge in flavors that can''t be found anywhere else.', ARRAY['product-images/p106.jpg'], 50, 5.0, 22, false, false),
    ('Artisan Gift P107', 'p107', 180.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'A complete green ecosystem.', 'Maintenance-free beauty in an architectural setting.', ARRAY['product-images/p107.jpg'], 15, 4.8, 19, false, false),
    ('Artisan Gift P108', 'p108', 52.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Daily luxury for your well-being.', 'Pure, potent, and beautifully packaged.', ARRAY['product-images/p108.jpg'], 90, 4.7, 63, false, false),
    ('Artisan Gift P109', 'p109', 125.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Elegance defined by detail.', 'A signature accessory that complements any professional look.', ARRAY['product-images/p109.jpg'], 42, 4.9, 38, false, false),
    ('Artisan Gift P110', 'p110', 195.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Sculptural art for the discerning eye.', 'A bold statement piece that explores form and texture.', ARRAY['product-images/p110.jpg'], 12, 5.0, 15, true, false),
    ('Artisan Gift P111', 'p111', 64.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Modern tools for old traditions.', 'Premium materials for a writing experience that stands the test of time.', ARRAY['product-images/p111.jpg'], 75, 4.8, 52, false, false),
    ('Artisan Gift P112', 'p112', 110.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Quiet luxury for your morning ritual.', 'Designed to bring peace and focus to your daily routine.', ARRAY['product-images/p112.jpg'], 55, 4.7, 44, false, false),
    ('Artisan Gift P113', 'p113', 42.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'A small treat for big celebrations.', 'Hand-crafted with the finest spices and pure ingredients.', ARRAY['product-images/p113.jpg'], 140, 4.9, 156, false, false),
    ('Artisan Gift P114', 'p114', 175.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Precision design, artisan soul.', 'A piece that celebrates the intersection of geometry and craft.', ARRAY['product-images/p114.jpg'], 18, 5.0, 11, false, false),
    ('Artisan Gift P115', 'p115', 85.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Sustainably sourced, beautifully potted.', 'Bring a touch of nature''s beauty into your modern life.', ARRAY['product-images/p115.jpg'], 65, 4.8, 54, false, false),
    ('Artisan Gift P116', 'p116', 155.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Architectural form meet artisan touch.', 'A centerpiece designed to capture the attention and the light.', ARRAY['product-images/p116.jpg'], 25, 4.9, 22, false, false)
ON CONFLICT (slug) DO NOTHING;

-- Batch 0: Legacy Named Products (p1-p27)
INSERT INTO public.products (name, slug, price, category_name, category_id, short_desc, description, images, stock, rating, review_count, is_best_seller, is_new_arrival, occasion, recipient, vibe, details)
VALUES
    ('The Midnight Velvet Candle', 'midnight-velvet-candle', 48.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Hand-poured soy candle with notes of cedar, vanilla, and smoked leather.', 'Transform any room into a sanctuary with our signature Midnight Velvet Candle. Hand-poured in small batches using 100% natural soy wax.', ARRAY['product-images/product-candle.jpg'], 100, 5.0, 124, true, false, ARRAY['anniversary', 'just because', 'wedding', 'housewarming'], ARRAY['her', 'couple'], ARRAY['minimalist'], ARRAY['Burn time: 50+ hours', '100% natural soy wax']),
    ('Artisan Truffle Collection', 'artisan-truffle-collection', 65.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Twelve hand-crafted truffles featuring exotic flavors.', 'Indulge in twelve exquisite hand-crafted chocolate truffles, each a masterpiece of flavor. Belgian couverture with Persian saffron and cardamom.', ARRAY['product-images/product-chocolate.jpg'], 100, 5.0, 89, true, false, ARRAY['birthday', 'anniversary', 'celebration'], ARRAY['him', 'her', 'kids', 'parents'], ARRAY['foodie'], ARRAY['12 hand-crafted truffles', 'Belgian chocolate']),
    ('Golden Pendant Necklace', 'golden-pendant-necklace', 120.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Delicate 18K gold-plated pendant on a fine chain.', 'This minimalist pendant necklace is the embodiment of quiet luxury. Sterling silver with 18K gold plating.', ARRAY['product-images/product-jewelry.jpg'], 100, 5.0, 67, false, false, ARRAY['anniversary', 'birthday', 'valentines'], ARRAY['her'], ARRAY['minimalist'], ARRAY['18K Gold Plated', 'Hypoallergenic']),
    ('Living Succulent Gift', 'living-succulent-gift', 35.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'A beautiful potted succulent wrapped in kraft paper.', 'Bring a touch of nature indoors with our Living Succulent Gift. Hand-selected for health and beauty.', ARRAY['product-images/product-plant.jpg'], 100, 4.0, 203, false, false, ARRAY['newhome', 'just because', 'housewarming'], ARRAY['her', 'parents', 'him'], ARRAY['adventurer'], ARRAY['Ceramic pot included', 'Low maintenance']),
    ('Sunset Silk Scarf', 'sunset-silk-scarf', 85.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Luxurious hand-dyed silk scarf in warm sunset tones.', 'Wrap yourself in the warmth of a Mediterranean sunset. Hand-dyed mulberry silk transitioning from amber to terracotta.', ARRAY['product-images/product-scarf.jpg'], 100, 5.0, 56, false, false, ARRAY['birthday', 'anniversary', 'retirement'], ARRAY['her', 'parents'], ARRAY['minimalist'], ARRAY['100% Mulberry silk', 'Hand-dyed']),
    ('Artisan Ceramic Mug', 'artisan-ceramic-mug', 38.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Handcrafted ceramic mug with ocean-inspired glaze.', 'Individually thrown on the potter''s wheel. Reactive glaze creates a stunning gradient reminiscent of ocean meeting earth.', ARRAY['product-images/product-mug.jpg'], 100, 5.0, 142, false, false, ARRAY['newhome', 'just because', 'housewarming'], ARRAY['him', 'her', 'couple'], ARRAY['minimalist'], ARRAY['Handmade stoneware', '12 oz capacity']),
    ('Leather Bound Journal', 'leather-bound-journal', 55.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Premium full-grain leather journal with cream pages.', 'Crafted from full-grain vegetable-tanned leather. 192 pages of acid-free cream paper welcome any pen.', ARRAY['product-images/product-journal.jpg'], 100, 5.0, 91, false, false, ARRAY['birthday', 'just because', 'graduation'], ARRAY['him', 'her', 'kids'], ARRAY['adventurer'], ARRAY['Full-grain leather', 'Lay-flat binding']),
    ('Zen Essential Diffuser', 'zen-essential-diffuser', 72.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Elegant wood & ceramic aromatherapy diffuser.', 'Ultrasonic technology creates a fine, whisper-quiet mist. Minimalist design in natural beechwood and ceramic.', ARRAY['product-images/product-diffuser.jpg'], 100, 4.0, 178, false, false, ARRAY['newhome', 'just because', 'housewarming'], ARRAY['her', 'couple', 'parents'], ARRAY['minimalist'], ARRAY['200ml tank', 'Auto shut-off']),
    ('Ceremonial Tea Gift Set', 'ceremonial-tea-set', 78.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Five single-origin teas in a walnut presentation box.', 'A curated journey through the world''s finest tea gardens. Hand-finished walnut box with brass hardware.', ARRAY['product-images/product-tea.jpg'], 100, 5.0, 63, false, false, ARRAY['birthday', 'anniversary', 'retirement'], ARRAY['him', 'her', 'parents'], ARRAY['foodie'], ARRAY['5 single-origin teas', 'Walnut box']),
    ('Cashmere Cloud Throw', 'cashmere-cloud-throw', 195.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Ultra-soft cashmere-blend throw blanket.', 'Knitted from premium Mongolian cashmere and fine merino wool. Cable-knit pattern in natural cream.', ARRAY['product-images/product-blanket.jpg'], 100, 5.0, 44, false, false, ARRAY['newhome', 'anniversary', 'wedding', 'housewarming'], ARRAY['her', 'couple', 'parents'], ARRAY['minimalist'], ARRAY['70% Cashmere', '50" x 70"']),
    ('Heritage Timepiece', 'heritage-timepiece', 245.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Classic watch with Italian leather strap.', 'Marries Swiss quartz precision with Italian leather craftsmanship. Sapphire crystal and stainless steel case.', ARRAY['product-images/product-watch.jpg'], 100, 5.0, 38, false, false, ARRAY['birthday', 'anniversary', 'graduation', 'retirement'], ARRAY['him'], ARRAY['adventurer'], ARRAY['Swiss Movement', 'Sapphire Crystal']),
    ('Botanical Soap Collection', 'botanical-soap-collection', 42.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Four artisan soaps with botanical extracts.', 'Cold-processed from organic oils and butter. Includes lavender, eucalyptus, rose, and oat varieties.', ARRAY['product-images/product-soap.jpg'], 100, 4.0, 167, false, false, ARRAY['birthday', 'just because', 'valentines'], ARRAY['her', 'parents'], ARRAY['foodie'], ARRAY['Organic oils', 'Cold-processed']),
    ('Classic Artisan P18', 'p18', 65.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Elegant home accent.', 'A beautiful handcrafted piece for your living space.', ARRAY['product-images/p18.png'], 100, 4.8, 12, false, false, ARRAY['birthday'], ARRAY['her'], ARRAY['minimalist'], ARRAY['Handmade', 'Eco-friendly']),
    ('Classic Artisan P19', 'p19', 45.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Artisanal culinary delight.', 'Exquisite flavors sourced from organic farms.', ARRAY['product-images/p19.png'], 100, 4.9, 22, false, false, ARRAY['just because'], ARRAY['foodie'], ARRAY['rich'], ARRAY['Organic', 'Small batch']),
    ('Classic Artisan P20', 'p20', 120.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Timeless wearable art.', 'A statement piece for any modern collection.', ARRAY['product-images/p20.png'], 100, 5.0, 8, false, false, ARRAY['anniversary'], ARRAY['her'], ARRAY['elegant'], ARRAY['Silver', 'Hand-polished']),
    ('Classic Artisan P21', 'p21', 35.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Nature in a pot.', 'Bring life to your home with this beautiful botanical.', ARRAY['product-images/p21.png'], 100, 4.7, 31, false, false, ARRAY['housewarming'], ARRAY['parents'], ARRAY['organic'], ARRAY['Living', 'Potted']),
    ('Classic Artisan P22', 'p22', 85.00, 'Bath & Wellness', (SELECT id FROM public.categories WHERE name = 'Bath & Wellness' LIMIT 1), 'Mindful self-care ritual.', 'Pure botanical extracts for your daily routine.', ARRAY['product-images/p22.png'], 100, 4.8, 15, false, false, ARRAY['self care'], ARRAY['her'], ARRAY['calming'], ARRAY['Vegan', 'Natural']),
    ('Classic Artisan P23', 'p23', 55.00, 'Stationery & Books', (SELECT id FROM public.categories WHERE name = 'Stationery & Books' LIMIT 1), 'Classic tools for expression.', 'Inspire your creativity with these fine tools.', ARRAY['product-images/p23.png'], 100, 4.8, 44, false, false, ARRAY['graduation'], ARRAY['him'], ARRAY['classic'], ARRAY['Acid-free', 'Linen']),
    ('Classic Artisan P24', 'p24', 195.00, 'Home & Ambiance', (SELECT id FROM public.categories WHERE name = 'Home & Ambiance' LIMIT 1), 'Centerpiece of luxury.', 'Bold design meets meticulous artisan skill.', ARRAY['product-images/p24.png'], 100, 5.0, 7, true, false, ARRAY['wedding'], ARRAY['couple'], ARRAY['luxurious'], ARRAY['Limited edition', 'Large']),
    ('Classic Artisan P25', 'p25', 72.00, 'Gourmet & Sweets', (SELECT id FROM public.categories WHERE name = 'Gourmet & Sweets' LIMIT 1), 'Pure heirloom recipe.', 'A taste of tradition in every bite.', ARRAY['product-images/p25.png'], 100, 4.7, 18, false, false, ARRAY['holiday'], ARRAY['family'], ARRAY['traditional'], ARRAY['Heirloom', 'Handmade']),
    ('Classic Artisan P26', 'p26', 220.00, 'Jewelry & Accessories', (SELECT id FROM public.categories WHERE name = 'Jewelry & Accessories' LIMIT 1), 'Exquisite metalwork.', 'A unique piece carrying the soul of the maker.', ARRAY['product-images/p26.png'], 100, 5.0, 4, false, true, ARRAY['anniversary'], ARRAY['her'], ARRAY['unique'], ARRAY['Bespoke', 'Gold']),
    ('Classic Artisan P27', 'p27', 38.00, 'Plants & Green Living', (SELECT id FROM public.categories WHERE name = 'Plants & Green Living' LIMIT 1), 'Eco-beauty for gardeners.', 'Sustainable greenery for the modern home.', ARRAY['product-images/p27.png'], 100, 4.6, 62, false, false, ARRAY['just because'], ARRAY['her'], ARRAY['vibrant'], ARRAY['Renewable', 'Minimalist'])
ON CONFLICT (slug) DO NOTHING;
