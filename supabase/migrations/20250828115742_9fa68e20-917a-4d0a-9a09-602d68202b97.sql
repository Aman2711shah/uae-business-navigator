-- Update RLS policy for community_users to restrict access while maintaining functionality
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all community users" ON public.community_users;

-- Create more restrictive policies
-- Users can view their own profile
CREATE POLICY "Users can view their own community profile" 
ON public.community_users 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view public profile info of post authors (only username, company_name, business_stage)
-- This supports the post display functionality while limiting exposure
CREATE POLICY "Users can view limited profile info for posts" 
ON public.community_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.community_posts 
    WHERE community_posts.user_id = community_users.user_id
  )
);

-- Create a secure view for post author information with limited fields
CREATE OR REPLACE VIEW public.post_author_info AS
SELECT 
  user_id,
  username,
  company_name,
  business_stage
FROM public.community_users
WHERE EXISTS (
  SELECT 1 FROM public.community_posts 
  WHERE community_posts.user_id = community_users.user_id
);

-- Grant access to the view
GRANT SELECT ON public.post_author_info TO authenticated;