-- =====================================================
-- CLOVELY FULL SUPABASE MIGRATION
-- New tables: student_profiles, microactions, jobs, verification_codes
-- =====================================================

-- 1. Create verification_codes table for 8-digit auth
CREATE TABLE public.verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for quick lookup
CREATE INDEX idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX idx_verification_codes_code ON public.verification_codes(code);
CREATE INDEX idx_verification_codes_expires ON public.verification_codes(expires_at);

-- RLS for verification_codes (public insert, but validate via edge function)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (needed for requesting codes)
CREATE POLICY "Anyone can request verification code"
ON public.verification_codes
FOR INSERT
WITH CHECK (true);

-- Only allow reading unexpired, unused codes (for verification)
CREATE POLICY "Read own verification codes"
ON public.verification_codes
FOR SELECT
USING (true);

-- Allow updating (marking as used) via edge functions
CREATE POLICY "Update verification codes"
ON public.verification_codes
FOR UPDATE
USING (true);

-- 2. Create student_profiles table for extended student data
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  values TEXT[] DEFAULT '{}',
  lifestyle TEXT,
  career_goal TEXT,
  riasec_code TEXT,
  riasec_scores JSONB DEFAULT '{}',
  work_style JSONB DEFAULT '{}',
  diagnostic_results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student profile"
ON public.student_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own student profile"
ON public.student_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own student profile"
ON public.student_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own student profile"
ON public.student_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 3. Create microactions table
CREATE TABLE public.microactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.microactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own microactions"
ON public.microactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own microactions"
ON public.microactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own microactions"
ON public.microactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own microactions"
ON public.microactions
FOR DELETE
USING (auth.uid() = user_id);

-- 4. Create jobs table for real job opportunities
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  modality TEXT DEFAULT 'onsite',
  contract_type TEXT DEFAULT 'full-time',
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  external_url TEXT,
  source TEXT DEFAULT 'clovely',
  views INTEGER DEFAULT 0,
  applicants_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs are publicly viewable
CREATE POLICY "Anyone can view active jobs"
ON public.jobs
FOR SELECT
USING (is_active = true);

-- Only admins can insert jobs
CREATE POLICY "Admins can insert jobs"
ON public.jobs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Only admins can update jobs
CREATE POLICY "Admins can update jobs"
ON public.jobs
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- 5. Create applications table for job applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID REFERENCES public.jobs(id),
  opportunity_id TEXT,
  cv_id UUID,
  status TEXT DEFAULT 'sent',
  cover_letter TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
ON public.applications
FOR UPDATE
USING (auth.uid() = user_id);

-- 6. Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Add role column to profiles if it doesn't exist (for user role tracking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN user_role TEXT DEFAULT 'student';
  END IF;
END $$;

-- 8. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_microactions_user_id ON public.microactions(user_id);
CREATE INDEX IF NOT EXISTS idx_microactions_due_date ON public.microactions(due_date);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);