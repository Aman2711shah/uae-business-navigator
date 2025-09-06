-- Create a more secure approach with column-level security
-- Create a view for public profile data that excludes sensitive columns
CREATE OR REPLACE VIEW public.safe_profiles AS
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
ALTER VIEW public.safe_profiles SET (security_barrier = true);

-- Grant appropriate access to the safe view
GRANT SELECT ON public.safe_profiles TO authenticated, anon;

-- Update the main profiles table to be more restrictive
-- Drop existing policy
DROP POLICY IF EXISTS "Public can view safe profile data" ON public.profiles;

-- Create highly restrictive policy for profiles table - only owner can see their full profile
CREATE POLICY "Users can only view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Function to check if a user can view a specific profile field
CREATE OR REPLACE FUNCTION public.can_view_profile_field(
  profile_user_id uuid, 
  field_name text
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE 
    WHEN field_name IN ('email', 'full_name') THEN 
      auth.uid() = profile_user_id AND auth.uid() IS NOT NULL
    ELSE 
      true -- Public fields like display_name, bio, etc.
  END;
$$;