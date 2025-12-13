-- Fix 1: Add explicit deny policy for anonymous access to profiles table
-- This ensures unauthenticated users cannot access any profile data
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Fix 2: Add explicit deny policies for UPDATE and DELETE on analytics_events
-- This ensures analytics data integrity by explicitly blocking modifications
CREATE POLICY "Deny update on analytics_events"
ON public.analytics_events
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Deny delete on analytics_events"
ON public.analytics_events
FOR DELETE
TO authenticated
USING (false);

-- Also deny anonymous access to analytics_events
CREATE POLICY "Deny anonymous access to analytics_events"
ON public.analytics_events
FOR ALL
TO anon
USING (false);