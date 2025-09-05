-- Fix User Personal Information Exposure in community_users table
-- Remove public access and restrict to authenticated users only

-- Drop the existing policy that allows public access through post associations
DROP POLICY IF EXISTS "Users can view limited profile info for posts" ON public.community_users;

-- Create new policy that restricts community user data to authenticated users only
CREATE POLICY "Authenticated users can view community profiles for posts" 
ON public.community_users 
FOR SELECT 
TO authenticated
USING (EXISTS ( 
    SELECT 1
    FROM community_posts
    WHERE community_posts.user_id = community_users.user_id
));

-- Ensure users can still view their own community profile (keep existing policy)
-- This policy should already exist but let's make sure it's properly defined
DROP POLICY IF EXISTS "Users can view their own community profile" ON public.community_users;
CREATE POLICY "Users can view their own community profile" 
ON public.community_users 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Revoke any public access to prevent anonymous harvesting
REVOKE ALL ON public.community_users FROM PUBLIC;
REVOKE ALL ON public.community_users FROM anon;