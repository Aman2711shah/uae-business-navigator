-- Security hardening for storage policies and admin setup

-- Update community images storage policy to require authentication
DROP POLICY IF EXISTS "Users can upload community images" ON storage.objects;

CREATE POLICY "Authenticated users can upload community images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
);

-- Create initial admin user function call helper
CREATE OR REPLACE FUNCTION public.setup_initial_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_count int;
  result_msg text;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    result_msg := 'Admin user already exists. No action needed.';
  ELSE
    result_msg := 'No admin user found. Please use create_initial_admin function with a valid email.';
  END IF;
  
  RETURN result_msg;
END;
$$;