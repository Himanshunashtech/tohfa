-- Migration to add sort_order to public.products

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Set sequential sort_order for existing products based on their creation date
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_number
  FROM public.products
)
UPDATE public.products
SET sort_order = numbered_products.row_number
FROM numbered_products
WHERE public.products.id = numbered_products.id;
