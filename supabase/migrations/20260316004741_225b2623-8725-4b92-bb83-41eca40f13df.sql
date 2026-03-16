-- Create access tier enum for product-level routing and permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'access_tier' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.access_tier AS ENUM ('trial_user', 'free_user', 'premium_user');
  END IF;
END $$;

-- Create dedicated table for user access tiers
CREATE TABLE IF NOT EXISTS public.user_access_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  access_level public.access_tier NOT NULL DEFAULT 'free_user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_access_levels ENABLE ROW LEVEL SECURITY;

-- Policies: users can read their own access level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_access_levels'
      AND policyname = 'Users can view own access level'
  ) THEN
    CREATE POLICY "Users can view own access level"
    ON public.user_access_levels
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policies: admins can manage all access levels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_access_levels'
      AND policyname = 'Admins can manage access levels'
  ) THEN
    CREATE POLICY "Admins can manage access levels"
    ON public.user_access_levels
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Trigger support for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_user_access_levels_updated_at'
  ) THEN
    CREATE TRIGGER update_user_access_levels_updated_at
    BEFORE UPDATE ON public.user_access_levels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Backfill existing authenticated profiles to free_user if missing
INSERT INTO public.user_access_levels (user_id, access_level)
SELECT p.id, 'free_user'::public.access_tier
FROM public.profiles p
LEFT JOIN public.user_access_levels ual ON ual.user_id = p.id
WHERE ual.user_id IS NULL;

-- Ensure new users get a default free access level
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, nombre, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', new.raw_user_meta_data->>'name', 'Usuario'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    nombre = excluded.nombre,
    email = excluded.email,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  insert into public.user_access_levels (user_id, access_level)
  values (new.id, 'free_user')
  on conflict (user_id) do nothing;

  return new;
end;
$function$;