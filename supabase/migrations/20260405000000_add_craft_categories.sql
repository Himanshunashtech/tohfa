-- Add Craft-based Categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Metal', 'metal', 'Handcrafted metalwork from traditional smiths.', 10),
('Wood', 'wood', 'Artisanal wood carvings and home essentials.', 20),
('Ceramics', 'ceramics', 'Hand-thrown pottery and ceramic art.', 30),
('Brass', 'brass', 'Traditional brassware and elegant decor.', 40),
('Paintings', 'paintings', 'Original artworks and traditional folk paintings.', 50)
ON CONFLICT (slug) DO NOTHING;
