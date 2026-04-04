
-- =============================================
-- TOFHAVERSE FULL BACKEND SCHEMA
-- =============================================

-- 1. ROLE ENUM & USER ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'Silver' CHECK (tier IN ('Silver', 'Gold', 'Platinum', 'Diamond')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. SECURITY DEFINER FUNCTION FOR ROLE CHECKS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. ARTISANS
CREATE TABLE public.artisans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role TEXT,
  location TEXT,
  bio TEXT,
  heritage TEXT,
  photo TEXT,
  studio_images TEXT[] DEFAULT '{}',
  products_count INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  category_name TEXT,
  occasion TEXT[] DEFAULT '{}',
  recipient TEXT[] DEFAULT '{}',
  vibe TEXT[] DEFAULT '{}',
  short_desc TEXT,
  description TEXT,
  details TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE SET NULL,
  specifications JSONB DEFAULT '[]',
  story TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled', 'Flagged')),
  order_type TEXT DEFAULT 'Personal' CHECK (order_type IN ('Gift', 'Personal')),
  slot TEXT DEFAULT 'Standard' CHECK (slot IN ('Midnight', 'Fixed-Time', 'Standard')),
  shipping_address TEXT,
  shipping_method TEXT,
  shipping_carrier TEXT,
  tracking_number TEXT,
  gift_recipient TEXT,
  gift_message TEXT,
  gift_wrap_style TEXT,
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  gift_wrap_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  grand_total NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'Pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  sku TEXT,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  personalization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. ORDER TIMELINE
CREATE TABLE public.order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. CART ITEMS
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  personalization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. WISHLIST ITEMS
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 14. ADDRESSES
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. PAYMENT METHODS
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL,
  last4 TEXT NOT NULL,
  expiry TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. USER OCCASIONS
CREATE TABLE public.user_occasions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  occasion_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. PROMOS
CREATE TABLE public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. CAMPAIGNS
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. PORTALS
CREATE TABLE public.portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT,
  primary_color TEXT,
  welcome_message TEXT,
  discount_pct INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  portal_orders INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. PORTAL FEATURED PRODUCTS
CREATE TABLE public.portal_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id UUID NOT NULL REFERENCES public.portals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  UNIQUE(portal_id, product_id)
);

-- 21. INVENTORY LOGS
CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  change_amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. STORE SETTINGS
CREATE TABLE public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'TofhaVerse Global',
  email TEXT DEFAULT 'ops@tofhaverse.com',
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'PST',
  settings_json JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. LOYALTY SETTINGS
CREATE TABLE public.loyalty_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  points_per_dollar INTEGER DEFAULT 5,
  tier_thresholds JSONB DEFAULT '{"silver": 0, "gold": 1000, "platinum": 5000, "diamond": 15000}',
  redemption_options JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. POINTS HISTORY
CREATE TABLE public.points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER ROLES
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- PUBLIC READ TABLES
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read artisans" ON public.artisans FOR SELECT USING (true);
CREATE POLICY "Admins manage artisans" ON public.artisans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read portals" ON public.portals FOR SELECT USING (active = true);
CREATE POLICY "Admins manage portals" ON public.portals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read portal products" ON public.portal_products FOR SELECT USING (true);
CREATE POLICY "Admins manage portal products" ON public.portal_products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- REVIEWS
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ORDERS
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own order timeline" ON public.order_timeline FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_timeline.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage order timeline" ON public.order_timeline FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER-SCOPED TABLES
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist" ON public.wishlist_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own payments" ON public.payment_methods FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own occasions" ON public.user_occasions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own points" ON public.points_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage points" ON public.points_history FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PROMOS
CREATE POLICY "Public read active promos" ON public.promos FOR SELECT USING (status = 'Active');
CREATE POLICY "Admins manage promos" ON public.promos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CAMPAIGNS
CREATE POLICY "Admins manage campaigns" ON public.campaigns FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read active campaigns" ON public.campaigns FOR SELECT USING (active = true);

-- INVENTORY LOGS
CREATE POLICY "Admins manage inventory logs" ON public.inventory_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- STORE/LOYALTY SETTINGS
CREATE POLICY "Admins manage store settings" ON public.store_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage loyalty settings" ON public.loyalty_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read loyalty settings" ON public.loyalty_settings FOR SELECT USING (true);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portals_updated_at BEFORE UPDATE ON public.portals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_settings_updated_at BEFORE UPDATE ON public.loyalty_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_artisan ON public.products(artisan_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_wishlist_items_user ON public.wishlist_items(user_id);
CREATE INDEX idx_addresses_user ON public.addresses(user_id);
CREATE INDEX idx_points_history_user ON public.points_history(user_id);
CREATE INDEX idx_artisans_slug ON public.artisans(slug);
CREATE INDEX idx_portals_slug ON public.portals(slug);

-- =============================================
-- SEED DATA
-- =============================================
INSERT INTO public.store_settings (store_name, email, currency, timezone, settings_json)
VALUES ('TofhaVerse Global', 'ops@tofhaverse.com', 'USD', 'PST', '{
  "payments": {"stripe": {"active": true}, "paypal": {"active": true}, "crypto": {"active": false}},
  "shipping": {"midnightSurcharge": 15, "fixedTimeSurcharge": 8, "standardDelivery": 5, "freeThreshold": 100},
  "notifications": {"orderAlerts": true, "lowStockAlerts": true, "signupAlerts": false}
}');

INSERT INTO public.loyalty_settings (points_per_dollar, tier_thresholds, redemption_options)
VALUES (5, '{"silver": 0, "gold": 1000, "platinum": 5000, "diamond": 15000}', '[
  {"id": "r1", "label": "$5 Discount", "points": 500, "value": "5"},
  {"id": "r2", "label": "$15 Discount", "points": 1500, "value": "15"},
  {"id": "r3", "label": "$50 Discount", "points": 5000, "value": "50"},
  {"id": "r4", "label": "Free Shipping", "points": 300, "value": "shipping"}
]');

INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Home & Ambiance', 'home-ambiance', 1),
  ('Gourmet & Sweets', 'gourmet-sweets', 2),
  ('Jewelry & Accessories', 'jewelry-accessories', 3),
  ('Plants & Green Living', 'plants-green-living', 4),
  ('Stationery & Books', 'stationery-books', 5),
  ('Bath & Wellness', 'bath-wellness', 6);

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
