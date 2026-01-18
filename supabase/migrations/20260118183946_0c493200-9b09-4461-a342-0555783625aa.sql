-- Fix universities table RLS policies
-- 1. Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create a university during registration" ON public.universities;

-- 2. Create proper INSERT policy - only authenticated users can create
CREATE POLICY "Authenticated users can create universities"
ON public.universities
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 3. Add SELECT policy so students can view their enrolled university
CREATE POLICY "Students can view their enrolled university"
ON public.universities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM university_students
    WHERE university_students.university_id = universities.id
    AND university_students.student_user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM university_admins
    WHERE university_admins.university_id = universities.id
    AND university_admins.user_id = auth.uid()
  )
);

-- 4. Add validation constraints for universities table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'universities_name_not_empty'
  ) THEN
    ALTER TABLE public.universities ADD CONSTRAINT universities_name_not_empty CHECK (length(name) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'universities_name_length'
  ) THEN
    ALTER TABLE public.universities ADD CONSTRAINT universities_name_length CHECK (length(name) <= 200);
  END IF;
END $$;

-- 5. Change update_updated_at_column to SECURITY INVOKER (safer)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;