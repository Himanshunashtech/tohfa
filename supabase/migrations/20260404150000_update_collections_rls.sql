-- Relax RLS for collections and collection_products to allow all authenticated users
-- This resolves the 403 Forbidden error (42501) when adding/deleting products from collections

DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
CREATE POLICY "Admins can manage collections" ON public.collections
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage collection products" ON public.collection_products;
CREATE POLICY "Admins can manage collection products" ON public.collection_products
    FOR ALL USING (auth.role() = 'authenticated');
