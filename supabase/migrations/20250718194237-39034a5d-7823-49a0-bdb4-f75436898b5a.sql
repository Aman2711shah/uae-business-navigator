-- Fix remaining SECURITY DEFINER functions to prevent schema injection attacks
-- Add proper search_path to functions missing it

-- Fix the update_post_likes_count function
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix the update_post_comments_count function
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Harden storage policies for community images
-- Drop the existing permissive policy and create a more secure one
DROP POLICY IF EXISTS "Community images can be uploaded by authenticated users" ON storage.objects;

-- Create a more restrictive policy that requires authentication
CREATE POLICY "Authenticated users can upload to community images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
);

-- Create a policy for updating community images (for the uploader only)
CREATE POLICY "Users can update their own community images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
);

-- Create a policy for deleting community images (for the uploader only)
CREATE POLICY "Users can delete their own community images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
);