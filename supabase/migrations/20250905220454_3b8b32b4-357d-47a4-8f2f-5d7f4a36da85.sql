-- Fix critical security vulnerability in submissions table
-- Remove the policy that allows public access to NULL user_id submissions
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.submissions;

-- Create a more secure policy that only allows users to view their own submissions
-- AND requires authentication (no guest access for viewing)
CREATE POLICY "Users can view their own submissions" ON public.submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Update the insert policy to require authentication
DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;

CREATE POLICY "Authenticated users can create submissions" ON public.submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Keep admin access for all submissions
-- (This policy already exists and is secure)