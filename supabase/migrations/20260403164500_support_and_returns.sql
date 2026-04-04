-- Migration: Support Tickets & Order Returns
-- Created At: 2026-04-03T16:45:00Z
-- Updated: Optimized RLS with auth.jwt() and explicit Grants

-- 0. Clean Slate
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.order_returns CASCADE;

-- 1. Create Support Tickets Table
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT,
    email TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    order_id TEXT, -- Human readable order number like #1234
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Replied', 'Resolved', 'Closed')),
    priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
    replies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Order Returns Table
CREATE TABLE public.order_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_number TEXT UNIQUE NOT NULL,
    order_id TEXT NOT NULL, -- Human readable order number
    raw_order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Rejected', 'Processing', 'Refunded', 'Completed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Security Configuration
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated and anon roles
GRANT ALL ON TABLE public.support_tickets TO authenticated;
GRANT ALL ON TABLE public.order_returns TO authenticated;
GRANT ALL ON TABLE public.support_tickets TO anon;
GRANT ALL ON TABLE public.order_returns TO anon;

-- 4. RLS Policies for Support Tickets
-- Priority 1: Admin can access everything
CREATE POLICY "Admin full access on tickets" ON public.support_tickets 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Priority 2: Users can view their own tickets (via UID or Email in JWT)
CREATE POLICY "Users can view their own tickets" ON public.support_tickets 
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = (auth.jwt() ->> 'email'));

-- Priority 2.1: Users can update their own tickets (to add replies)
CREATE POLICY "Users can update their own tickets" ON public.support_tickets 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id OR email = (auth.jwt() ->> 'email'));

-- Priority 3: Authenticated users can create tickets
CREATE POLICY "Users can create tickets" ON public.support_tickets 
    FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');

-- 5. RLS Policies for Order Returns
-- Priority 1: Admin can access everything
CREATE POLICY "Admin full access on returns" ON public.order_returns 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Priority 2: Users can view their own returns
CREATE POLICY "Users can view their own returns" ON public.order_returns 
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_email = (auth.jwt() ->> 'email'));

-- Priority 3: Users can initiate returns
CREATE POLICY "Users can initiate returns" ON public.order_returns 
    FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');

-- 6. Add Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_order_returns_updated_at
    BEFORE UPDATE ON public.order_returns
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


