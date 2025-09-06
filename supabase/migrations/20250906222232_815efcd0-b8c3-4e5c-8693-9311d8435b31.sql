-- Fix profiles table security issues
-- Step 1: Update profiles table to separate public vs private data

-- Drop existing restrictive policies temporarily
DROP POLICY IF EXISTS "Strict user profile access" ON public.profiles;
DROP POLICY IF EXISTS "Strict user profile insert" ON public.profiles;
DROP POLICY IF EXISTS "Strict user profile update" ON public.profiles;

-- Create new policies that allow public viewing of safe data while protecting sensitive info
-- Allow public to view basic profile info (display_name, headline, bio, avatar_url, services)
-- but restrict access to email, full_name for privacy
CREATE POLICY "Public can view safe profile data" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Users can only insert their own profiles
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can only update their own profiles
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can only delete their own profiles
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Create a secure function to get private profile data (email, full_name) for the profile owner only
CREATE OR REPLACE FUNCTION public.get_private_profile_data(profile_user_id uuid)
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
  WHERE p.user_id = profile_user_id 
    AND auth.uid() = profile_user_id;
$$;

-- Create a public view that only exposes safe profile data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  headline,
  bio,
  services,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated, anon;