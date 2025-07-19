-- Additional security hardening

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

-- Update storage policies for better security
DROP POLICY IF EXISTS "Authenticated users can upload community images" ON storage.objects;

CREATE POLICY "Authenticated users can upload community images with limits" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'community-images' 
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
  AND octet_length(content) <= 5242880  -- 5MB limit
  AND (storage.filename(name) ~* '\.(jpg|jpeg|png|gif|webp)$')  -- Only image files
);

-- Add policy for viewing community images
CREATE POLICY "Anyone can view community images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-images');

-- Secure application documents bucket
CREATE POLICY "Users can upload their own application documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
  AND octet_length(content) <= 10485760  -- 10MB limit
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