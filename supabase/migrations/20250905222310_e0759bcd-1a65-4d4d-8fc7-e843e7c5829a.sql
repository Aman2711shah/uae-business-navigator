-- Fix the security definer view issue
-- Remove security_barrier setting which is not needed for this use case
DROP VIEW IF EXISTS public.safe_profiles;

-- Create a regular view without security definer properties
CREATE VIEW public.safe_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  full_name,
  headline,
  bio,
  services,
  avatar_url,
  created_at,
  updated_at
  -- NOTE: email field is deliberately excluded to prevent data theft
FROM public.profiles
WHERE user_id = auth.uid();  -- Only show current user's data through this view