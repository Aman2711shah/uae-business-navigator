-- Security hardening - properly handle existing policies

-- Create function to check for admin users securely
CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
END;
$$;

-- Drop and recreate storage policies for better security
DROP POLICY IF EXISTS "Authenticated users can upload community images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all application documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view community images" ON storage.objects;

-- Community images policies
CREATE POLICY "Authenticated users can upload community images with limits" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
  AND (storage.filename(name) ~* '\.(jpg|jpeg|png|gif|webp)$')
);

CREATE POLICY "Anyone can view community images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-images');

-- Application documents policies
CREATE POLICY "Users can upload their own application documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own application documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all application documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND has_role(auth.uid(), 'admin')
);