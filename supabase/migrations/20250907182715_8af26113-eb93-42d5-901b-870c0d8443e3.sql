-- Fix Security Definer View issue by removing SECURITY DEFINER from get_current_user_profile function
-- This function only accesses the current user's own data, so SECURITY DEFINER is unnecessary

-- Drop the existing function
DROP FUNCTION IF EXISTS public.get_current_user_profile();

-- Recreate the function without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  display_name text, 
  headline text, 
  bio text, 
  services text[], 
  avatar_url text, 
  email text, 
  full_name text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.headline,
    p.bio,
    p.services,
    p.avatar_url,
    p.email,
    p.full_name,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = auth.uid() 
    AND auth.uid() IS NOT NULL;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;

-- Add a comment explaining the security model
COMMENT ON FUNCTION public.get_current_user_profile() IS 
'Returns current user profile data. Uses SECURITY INVOKER to respect RLS policies and ensure users can only access their own profile data.';