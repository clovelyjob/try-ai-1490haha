-- Add DELETE policy for interview_sessions table
-- Allows users to delete their own interview sessions (GDPR compliance)
CREATE POLICY "Users can delete own interview sessions"
  ON public.interview_sessions
  FOR DELETE
  USING (auth.uid() = user_id);