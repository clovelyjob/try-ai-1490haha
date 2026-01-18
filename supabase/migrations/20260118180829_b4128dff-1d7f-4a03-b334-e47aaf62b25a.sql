-- Fix RLS policies for verification_codes table
-- These operations should ONLY happen via edge functions using service role key
-- So we can restrict all direct access

DROP POLICY IF EXISTS "Anyone can request verification code" ON public.verification_codes;
DROP POLICY IF EXISTS "Read own verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Update verification codes" ON public.verification_codes;

-- No direct access from client - all operations via edge functions with service role
-- Edge functions bypass RLS when using service role key
CREATE POLICY "Deny direct client access to verification_codes"
ON public.verification_codes
FOR ALL
USING (false);