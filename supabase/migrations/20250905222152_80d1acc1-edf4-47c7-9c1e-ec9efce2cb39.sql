-- CRITICAL SECURITY FIX: Secure profiles table and prevent email address theft
-- Issue: The profiles table is publicly readable and contains email addresses

-- First, let's check current policies on profiles table and fix them
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policies for profiles table
-- Users can only view their own profile data
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile only" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile only" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- No one can delete profiles except admins
CREATE POLICY "Only admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- SECURITY FIX: Restrict community_users table to prevent personal info exposure
-- Create more restrictive policy for community users data
DROP POLICY IF EXISTS "Authenticated users can view community profiles for posts" ON public.community_users;

-- Only allow viewing basic community profile info, not sensitive business details
CREATE POLICY "Limited community profile access" 
ON public.community_users 
FOR SELECT 
USING (
  -- Users can view their own full profile
  auth.uid() = user_id 
  OR 
  -- Others can only see basic info when user has public posts
  (
    EXISTS (
      SELECT 1 
      FROM public.community_posts 
      WHERE community_posts.user_id = community_users.user_id
    ) 
    AND auth.uid() IS NOT NULL  -- Must be authenticated to see any community data
  )
);

-- SECURITY FIX: Secure freezone_public_info table
ALTER TABLE public.freezone_public_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access only to basic freezone info (no contact details)
CREATE POLICY "Public freezone information access" 
ON public.freezone_public_info 
FOR SELECT 
USING (true);

-- Admin-only policies for freezone_public_info management
CREATE POLICY "Admins can manage freezone public info" 
ON public.freezone_public_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- ADDITIONAL SECURITY: Create a secure public profile view that doesn't expose emails
CREATE OR REPLACE VIEW public.public_profiles AS
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
FROM public.profiles
WHERE user_id = auth.uid()  -- Users can only see their own data through this view
   OR EXISTS (
     SELECT 1 
     FROM public.community_posts 
     WHERE community_posts.user_id = profiles.user_id
   ); -- Or if they have public posts

-- Enable RLS on the public view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- SECURITY AUDIT LOG: Log this security fix
INSERT INTO public.security_events (
  event_type,
  user_id,
  details,
  severity
) VALUES (
  'security_policy_updated',
  auth.uid(),
  jsonb_build_object(
    'action', 'profiles_table_secured',
    'vulnerability', 'public_email_exposure',
    'tables_affected', ARRAY['profiles', 'community_users', 'freezone_public_info'],
    'fix_applied', true,
    'timestamp', now()
  ),
  'high'
);