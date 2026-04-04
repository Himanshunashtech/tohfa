
-- =============================================
-- TOFHAVERSE ADVANCED BACKEND LOGIC (RPCs)
-- =============================================

-- 1. AWARD LOYALTY POINTS
-- Updates profile points and logs history atomically
CREATE OR REPLACE FUNCTION public.award_loyalty_points(p_email TEXT, p_points INTEGER, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find user associated with the profile email
  SELECT user_id INTO v_user_id FROM public.profiles WHERE email = p_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Customer with email % not found', p_email;
  END IF;

  -- Update profiles table
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + p_points,
      updated_at = now()
  WHERE user_id = v_user_id;

  -- Log the event in points history
  INSERT INTO public.points_history (user_id, points, reason, created_at)
  VALUES (v_user_id, p_points, p_reason, now());
END;
$$;

-- 2. SYNC ARTISAN INVENTORY
-- Simulated heartbeat sync with artisan workshops
CREATE OR REPLACE FUNCTION public.sync_artisan_inventory()
RETURNS TABLE (synchronized_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- For this showcase, we log a sync event for all active artisan products
  -- and return the count of products "verified"
  INSERT INTO public.inventory_logs (product_id, product_name, change_amount, reason, created_at)
  SELECT id, name, 0, 'Establish Heartbeat: Real-time Workshop Sync', now()
  FROM public.products
  WHERE active = true AND artisan_id IS NOT NULL;

  SELECT count(*)::INTEGER INTO v_count 
  FROM public.products 
  WHERE active = true AND artisan_id IS NOT NULL;

  RETURN QUERY SELECT v_count;
END;
$$;

-- 3. CREATE PRODUCT WITH INITIAL LOG
-- Ensures that when a product is created, an inventory log entry follows
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
    vibe, details, story, specifications
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
    p_product->'specifications'
  )
  RETURNING id, stock INTO v_new_id, v_stock;

  -- Create initial inventory log
  INSERT INTO public.inventory_logs (product_id, product_name, change_amount, reason, created_at)
  VALUES (v_new_id, p_product->>'name', v_stock, 'Initial Inventory Stocking', now());

  RETURN v_new_id;
END;
$$;

-- 4. GRANT PERMISSIONS TO AUTHENTICATED USERS (ADMINS)
GRANT EXECUTE ON FUNCTION public.award_loyalty_points(TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.sync_artisan_inventory() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_product_with_log(JSONB) TO authenticated;
