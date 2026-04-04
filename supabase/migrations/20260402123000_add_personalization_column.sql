-- =============================================
-- ADD PERSONALIZATION COLUMN TO PRODUCTS
-- =============================================

-- Add the column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='has_personalization') THEN
        ALTER TABLE public.products ADD COLUMN has_personalization BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update the add_product_with_log function to handle the new column
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
    vibe, details, story, specifications, has_personalization
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
    p_product->'specifications',
    COALESCE((p_product->>'has_personalization')::BOOLEAN, false)
  )
  RETURNING id, stock INTO v_new_id, v_stock;

  -- Create initial inventory log
  INSERT INTO public.inventory_logs (product_id, product_name, change_amount, reason, created_at)
  VALUES (v_new_id, p_product->>'name', v_stock, 'Initial Inventory Stocking', now());

  RETURN v_new_id;
END;
$$;
