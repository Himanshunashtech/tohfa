-- =============================================
-- ELITE PERSONALIZATION ENGINE SCHEMA
-- =============================================

-- 1. Add personalization_config to products
-- This JSONB field stores the per-product configuration for customizations
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_config JSONB DEFAULT '{
  "supportsMonogramming": false,
  "supportsVideoMessage": false,
  "supportsEngraving": false,
  "monogramPrice": 5.00,
  "videoPrice": 9.99,
  "engravingPrice": 12.00,
  "monogramLimit": 3
}';

-- 2. Convert personalization columns to JSONB for structured data
-- This allows storing monogram text, video URLs, and custom notes in a single field

-- Update cart_items
ALTER TABLE public.cart_items 
  ALTER COLUMN personalization TYPE JSONB 
  USING (CASE 
    WHEN personalization IS NULL THEN NULL 
    ELSE jsonb_build_object('text', personalization) 
  END);

-- Update order_items
ALTER TABLE public.order_items 
  ALTER COLUMN personalization TYPE JSONB 
  USING (CASE 
    WHEN personalization IS NULL THEN NULL 
    ELSE jsonb_build_object('text', personalization) 
  END);

-- 3. Update add_product_with_log function to include personalization_config
CREATE OR REPLACE FUNCTION public.add_product_with_log(p_product JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_id UUID;
  v_stock INTEGER;
BEGIN
  -- Insert product
  INSERT INTO public.products (
    slug, name, price, category_id, category_name, short_desc, 
    description, stock, artisan_id, active, created_at,
    images, is_best_seller, is_new_arrival, occasion, recipient, 
    vibe, details, story, specifications, has_personalization,
    personalization_config
  )
  VALUES (
    p_product->>'slug',
    p_product->>'name',
    (p_product->>'price')::NUMERIC(10,2),
    (p_product->>'category_id')::UUID,
    p_product->>'category_name',
    p_product->>'short_desc',
    p_product->>'description',
    (p_product->>'stock')::INTEGER,
    (p_product->>'artisan_id')::UUID,
    COALESCE((p_product->>'active')::BOOLEAN, true),
    now(),
    ARRAY(SELECT jsonb_array_elements_text(p_product->'images')),
    COALESCE((p_product->>'is_best_seller')::BOOLEAN, false),
    COALESCE((p_product->>'is_new_arrival')::BOOLEAN, false),
    ARRAY(SELECT jsonb_array_elements_text(p_product->'occasion')),
    ARRAY(SELECT jsonb_array_elements_text(p_product->'recipient')),
    ARRAY(SELECT jsonb_array_elements_text(p_product->'vibe')),
    ARRAY(SELECT jsonb_array_elements_text(p_product->'details')),
    p_product->>'story',
    COALESCE(p_product->'specifications', '[]'::JSONB),
    COALESCE((p_product->>'has_personalization')::BOOLEAN, false),
    COALESCE(p_product->'personalization_config', '{
      "supportsMonogramming": false,
      "supportsVideoMessage": false,
      "supportsEngraving": false,
      "monogramPrice": 5.00,
      "videoPrice": 9.99,
      "engravingPrice": 12.00,
      "monogramLimit": 3
    }'::JSONB)
  )
  RETURNING id, stock INTO v_new_id, v_stock;

  -- Create initial inventory log
  INSERT INTO public.inventory_logs (product_id, product_name, change_amount, reason, created_at)
  VALUES (v_new_id, p_product->>'name', v_stock, 'Initial Inventory Stocking', now());

  RETURN v_new_id;
END;
$$;
