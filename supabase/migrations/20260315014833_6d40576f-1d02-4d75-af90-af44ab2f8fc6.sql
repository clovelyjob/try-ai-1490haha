-- Insert missing profiles for all existing users
INSERT INTO public.profiles (id, nombre, email, avatar_url)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'nombre', u.raw_user_meta_data->>'name', 'Usuario'),
  u.email,
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Also insert missing user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;