
-- =============================================
-- AUTH SCHEMA FIX: EXTENSIONS & METADATA
-- =============================================

-- Ensure required extensions are available for Auth services
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patch existing admin user metadata if it exists
-- This fixes the 500 "Database error querying schema" caused by NULL metadata fields
UPDATE auth.users
SET 
  raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
  raw_user_meta_data = '{"full_name": "Tofha Admin", "role": "admin"}',
  is_sso_user = false,
  last_sign_in_at = now(),
  updated_at = now(),
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'admin@tofhaverse.com';

-- Ensure the identity exists for GoTrue login
-- This fixes the 500 error when logging in as a manually seeded user
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT 
  id, -- same as user_id for simplicity (usually unique)
  id, 
  format('{"sub":"%s", "email":"%s"}', id, email)::JSONB, 
  'email', 
  now(), 
  now(), 
  now()
FROM auth.users
WHERE email = 'admin@tofhaverse.com'
ON CONFLICT (provider, identity_data) DO UPDATE 
SET updated_at = now();

-- Ensure the public profile exists and matches
INSERT INTO public.profiles (user_id, email, display_name, updated_at)
SELECT id, email, 'Tofha Master Admin', now()
FROM auth.users
WHERE email = 'admin@tofhaverse.com'
ON CONFLICT (user_id) DO UPDATE 
SET display_name = EXCLUDED.display_name, updated_at = now();

-- Ensure the admin role exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'admin@tofhaverse.com'
ON CONFLICT (user_id, role) DO NOTHING;
