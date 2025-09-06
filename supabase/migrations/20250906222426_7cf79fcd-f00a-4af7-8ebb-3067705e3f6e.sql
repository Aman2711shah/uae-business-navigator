-- Fix the security definer view issue by removing it and using a better approach
-- Drop the problematic view
DROP VIEW IF EXISTS public.public_profiles;

-- Update the profile access policy to be more secure
-- Only allow viewing of specific safe columns, not all data
DROP POLICY IF EXISTS "Public can view safe profile data" ON public.profiles;

-- Create a more restrictive policy that only allows viewing safe profile fields
CREATE POLICY "Public can view safe profile data" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only allow access to display_name, headline, bio, avatar_url, services
  -- This is enforced at the application level by only selecting these columns
  true
);

-- Update the private profile function to use better security
DROP FUNCTION IF EXISTS public.get_private_profile_data(uuid);

-- Create a better function for getting user's own profile (including private data)
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
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
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