-- =============================================
-- ADD ADMIN REPLIES TO REVIEWS
-- =============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='status') THEN
        ALTER TABLE public.reviews ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='admin_reply') THEN
        ALTER TABLE public.reviews ADD COLUMN admin_reply TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='replied_at') THEN
        ALTER TABLE public.reviews ADD COLUMN replied_at TIMESTAMPTZ;
    END IF;
END $$;

-- Update RLS for admins to manage replies
CREATE POLICY "Admins can update reviews for replies" ON public.reviews 
    FOR UPDATE TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
