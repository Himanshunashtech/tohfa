-- Migration to add RPC for atomic order creation
-- Path: supabase/migrations/20260402160000_add_order_rpc.sql

CREATE OR REPLACE FUNCTION public.create_order(p_order JSONB, p_items JSONB[])
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- 1. Insert into orders
  INSERT INTO public.orders (
    order_number, 
    user_id, 
    customer_name, 
    customer_email, 
    status, 
    order_type, 
    slot, 
    shipping_address, 
    shipping_method, 
    shipping_carrier, 
    tracking_number, 
    gift_recipient, 
    gift_message, 
    gift_wrap_style, 
    subtotal, 
    tax, 
    delivery_fee, 
    gift_wrap_fee, 
    discount, 
    grand_total, 
    payment_method, 
    payment_status, 
    transaction_id,
    created_at,
    updated_at
  )
  VALUES (
    p_order->>'order_number',
    (p_order->>'user_id')::UUID,
    p_order->>'customer_name',
    p_order->>'customer_email',
    COALESCE(p_order->>'status', 'Processing'),
    p_order->>'order_type',
    p_order->>'slot',
    p_order->>'shipping_address',
    p_order->>'shipping_method',
    p_order->>'shipping_carrier',
    p_order->>'tracking_number',
    p_order->>'gift_recipient',
    p_order->>'gift_message',
    p_order->>'gift_wrap_style',
    (p_order->>'subtotal')::NUMERIC(10,2),
    (p_order->>'tax')::NUMERIC(10,2),
    (p_order->>'delivery_fee')::NUMERIC(10,2),
    (p_order->>'gift_wrap_fee')::NUMERIC(10,2),
    (p_order->>'discount')::NUMERIC(10,2),
    (p_order->>'grand_total')::NUMERIC(10,2),
    p_order->>'payment_method',
    p_order->>'payment_status',
    p_order->>'transaction_id',
    now(),
    now()
  )
  RETURNING id INTO v_order_id;

  -- 2. Insert into order_items
  FOREACH v_item IN ARRAY p_items LOOP
    INSERT INTO public.order_items (
      order_id, 
      product_id, 
      product_name, 
      product_image, 
      sku, 
      price, 
      quantity, 
      personalization, 
      created_at
    )
    VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      COALESCE(v_item->>'name', v_item->>'product_name'),
      COALESCE(v_item->>'image', v_item->>'product_image'),
      v_item->>'sku',
      (v_item->>'price')::NUMERIC(10,2),
      (v_item->>'qty')::INTEGER,
      v_item->>'personalization',
      now()
    );
  END LOOP;

  -- 3. Insert into order_timeline (Initial milestone)
  INSERT INTO public.order_timeline (order_id, status, description, is_current, created_at)
  VALUES (v_order_id, 'Processing', 'Order received and being processed.', true, now());

  RETURN v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order(JSONB, JSONB[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB, JSONB[]) TO anon;
