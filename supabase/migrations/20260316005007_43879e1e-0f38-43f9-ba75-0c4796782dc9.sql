DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_access_levels'
      AND policyname = 'Users can create own default access level'
  ) THEN
    CREATE POLICY "Users can create own default access level"
    ON public.user_access_levels
    FOR INSERT
    TO authenticated
    WITH CHECK (
      auth.uid() = user_id
      AND access_level = 'free_user'::public.access_tier
    );
  END IF;
END $$;