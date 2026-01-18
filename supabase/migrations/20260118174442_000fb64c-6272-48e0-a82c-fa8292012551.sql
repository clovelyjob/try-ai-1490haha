-- Update app_role enum to include university_admin
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'university_admin';

-- Create universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on universities
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Create university_admins table
CREATE TABLE public.university_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'viewer')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(university_id, user_id)
);

-- Enable RLS on university_admins
ALTER TABLE public.university_admins ENABLE ROW LEVEL SECURITY;

-- Create university_students table (links students to universities)
CREATE TABLE public.university_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career TEXT,
  cohort TEXT,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(university_id, student_user_id)
);

-- Enable RLS on university_students
ALTER TABLE public.university_students ENABLE ROW LEVEL SECURITY;

-- RLS Policies for universities
CREATE POLICY "University admins can view their own university"
ON public.universities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.university_admins
    WHERE university_admins.university_id = universities.id
    AND university_admins.user_id = auth.uid()
  )
);

CREATE POLICY "University owners can update their university"
ON public.universities
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.university_admins
    WHERE university_admins.university_id = universities.id
    AND university_admins.user_id = auth.uid()
    AND university_admins.role = 'owner'
  )
);

CREATE POLICY "Anyone can create a university during registration"
ON public.universities
FOR INSERT
WITH CHECK (true);

-- RLS Policies for university_admins
CREATE POLICY "Admins can view admins of their university"
ON public.university_admins
FOR SELECT
USING (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can manage admins of their university"
ON public.university_admins
FOR INSERT
WITH CHECK (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid() AND ua.role = 'owner'
  )
  OR NOT EXISTS (
    SELECT 1 FROM public.university_admins ua
    WHERE ua.university_id = university_admins.university_id
  )
);

CREATE POLICY "Owners can update admins of their university"
ON public.university_admins
FOR UPDATE
USING (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid() AND ua.role = 'owner'
  )
);

CREATE POLICY "Owners can delete admins of their university"
ON public.university_admins
FOR DELETE
USING (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid() AND ua.role = 'owner'
  )
);

-- RLS Policies for university_students
CREATE POLICY "University admins can view their students"
ON public.university_students
FOR SELECT
USING (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid()
  )
);

CREATE POLICY "University owners and admins can add students"
ON public.university_students
FOR INSERT
WITH CHECK (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid() AND ua.role IN ('owner', 'admin')
  )
);

CREATE POLICY "University owners and admins can remove students"
ON public.university_students
FOR DELETE
USING (
  university_id IN (
    SELECT ua.university_id FROM public.university_admins ua
    WHERE ua.user_id = auth.uid() AND ua.role IN ('owner', 'admin')
  )
);

-- Add trigger for updated_at on universities
CREATE TRIGGER update_universities_updated_at
BEFORE UPDATE ON public.universities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();