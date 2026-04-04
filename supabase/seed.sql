
-- =============================================
-- TOFHAVERSE ADMIN SEED
-- =============================================

-- 1. Create the Admin User in Auth
-- Email: admin@tofhaverse.com
-- Password: TofhaAdmin2024!
INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    role, 
    aud, 
    confirmation_token, 
    recovery_token, 
    email_change_token_new, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    is_sso_user, 
    created_at, 
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@tofhaverse.com',
    crypt('TofhaAdmin2024!', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '', '', '',
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Tofha Admin"}',
    false,
    now(), now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Create the Identity (Required for Login)
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '{"sub":"00000000-0000-0000-0000-000000000001", "email":"admin@tofhaverse.com"}'::JSONB,
    'email',
    now(),
    now(),
    now()
) ON CONFLICT (provider, identity_data) DO NOTHING;

-- 3. Update the role to 'admin'
-- (The trigger handle_new_user automatically creates the 'user' role record)
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- 3. Polish the Admin Profile
UPDATE public.profiles
SET display_name = 'Tofha Master Admin'
WHERE user_id = '00000000-0000-0000-0000-000000000001';
