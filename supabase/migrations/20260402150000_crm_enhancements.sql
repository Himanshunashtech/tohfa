-- Phase 3: Advanced CRM & Loyalty Infrastructure

-- 1. Add admin_notes and metadata to profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='admin_notes') THEN
        ALTER TABLE public.profiles ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- 2. Ensure loyalty_settings has default timestamps
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loyalty_settings' AND column_name='created_at') THEN
        ALTER TABLE public.loyalty_settings ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loyalty_settings' AND column_name='updated_at') THEN
        ALTER TABLE public.loyalty_settings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- 3. Create Points History Table for Audit Trail
CREATE TABLE IF NOT EXISTS public.points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    change_amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON public.points_history 
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. RPC to Award Points with History Log
CREATE OR REPLACE FUNCTION public.award_loyalty_points(p_email TEXT, p_points INTEGER, p_reason TEXT)
RETURNS void AS $$
DECLARE
    v_profile_id UUID;
BEGIN
    -- Get profile id
    SELECT id INTO v_profile_id FROM public.profiles WHERE email = p_email;
    
    IF v_profile_id IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- Update profile points
    UPDATE public.profiles 
    SET points = COALESCE(points, 0) + p_points 
    WHERE id = v_profile_id;

    -- Log history
    INSERT INTO public.points_history (profile_id, change_amount, reason)
    VALUES (v_profile_id, p_points, p_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
