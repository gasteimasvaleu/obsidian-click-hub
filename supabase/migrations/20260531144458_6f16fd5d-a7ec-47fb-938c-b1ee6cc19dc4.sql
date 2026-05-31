
-- One-shot: create VIP user Bernardo
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  hashed_pw text;
BEGIN
  hashed_pw := crypt('685213', gen_salt('bf'));

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'bernardorodrigues.13j@gmail.com',
    hashed_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Bernardo"}'::jsonb,
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'bernardorodrigues.13j@gmail.com', 'email_verified', true),
    'email',
    'bernardorodrigues.13j@gmail.com',
    now(), now(), now()
  );

  INSERT INTO public.subscribers (
    email, full_name, user_id, subscription_status,
    product_source, subscription_expires_at
  ) VALUES (
    'bernardorodrigues.13j@gmail.com',
    'Bernardo',
    new_user_id,
    'active',
    'vip',
    now() + interval '1 year'
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    full_name = EXCLUDED.full_name,
    subscription_status = 'active',
    product_source = 'vip',
    subscription_expires_at = EXCLUDED.subscription_expires_at,
    updated_at = now();
END $$;
