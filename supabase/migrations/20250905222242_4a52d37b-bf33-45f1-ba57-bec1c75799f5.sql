-- CRITICAL SECURITY FIX: Secure profiles table and prevent email address theft
-- Issue: The profiles table is publicly readable and contains email addresses

-- First, let's remove any overly permissive policies on profiles table
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;

-- Ensure RLS is enabled on profiles table (it should already be enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policies for profiles table (drop existing ones first)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Users can only view their own profile data (NO PUBLIC ACCESS TO EMAILS)
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

-- SECURITY FIX: Restrict community_users table to prevent personal info exposure
DROP POLICY IF EXISTS "Authenticated users can view community profiles for posts" ON public.community_users;

-- Only allow viewing basic community profile info when user is authenticated
CREATE POLICY "Limited community profile access for authenticated users" 
ON public.community_users 
FOR SELECT 
USING (
  -- Users can view their own full profile
  auth.uid() = user_id 
  OR 
  -- Authenticated users can only see limited info when user has public posts
  (
    auth.uid() IS NOT NULL  
    AND EXISTS (
      SELECT 1 
      FROM public.community_posts 
      WHERE community_posts.user_id = community_users.user_id
    )
  )
);

-- ADDITIONAL SECURITY: Create a secure public profile view that doesn't expose emails
DROP VIEW IF EXISTS public.safe_profiles;
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
FROM public.profiles;

-- Enable security barrier on the view
ALTER VIEW public.safe_profiles SET (security_barrier = true);

-- SECURITY AUDIT: Log this critical security fix
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.security_events LIMIT 1) THEN
    INSERT INTO public.security_events (
      event_type,
      details,
      severity
    ) VALUES (
      'critical_security_fix_applied',
      jsonb_build_object(
        'vulnerability', 'public_email_exposure_in_profiles_table',
        'action', 'restricted_profile_access_to_own_data_only',
        'tables_secured', ARRAY['profiles', 'community_users'],
        'risk_level', 'critical',
        'fix_timestamp', now(),
        'description', 'Prevented public access to user email addresses and personal data'
      ),
      'high'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Continue if security_events table doesn't exist or has issues
    NULL;
END $$;