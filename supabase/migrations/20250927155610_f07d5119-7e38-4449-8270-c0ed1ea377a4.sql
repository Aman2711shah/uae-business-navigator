-- Fix security issue: Secure business_applications table with proper RLS policies
-- This table contains sensitive customer data (emails, phone numbers) and needs proper access control

-- First, ensure RLS is enabled (it should already be enabled)
ALTER TABLE public.business_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Allow anon inserts" ON public.business_applications;

-- Create secure policies:

-- 1. Allow anonymous users to submit applications (for public forms)
CREATE POLICY "Allow anonymous application submissions" 
ON public.business_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 2. Only admins can read application data (contains PII)
CREATE POLICY "Admins can view all business applications" 
ON public.business_applications 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Only admins can update application data
CREATE POLICY "Admins can update business applications" 
ON public.business_applications 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Only admins can delete application data
CREATE POLICY "Admins can delete business applications" 
ON public.business_applications 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add logging function for sensitive data access on this table
CREATE OR REPLACE FUNCTION log_business_application_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when sensitive customer data is accessed
  PERFORM log_security_event(
    'sensitive_data_access',
    auth.uid(),
    NULL, -- IP address would need to be passed from application
    NULL, -- User agent would need to be passed from application
    jsonb_build_object(
      'table', 'business_applications',
      'action', TG_OP,
      'record_id', CASE WHEN TG_OP = 'DELETE' THEN OLD.phone ELSE NEW.phone END,
      'timestamp', now()
    ),
    'medium'
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- Create trigger to log access to sensitive data (fixed syntax)
CREATE TRIGGER log_business_application_access_trigger
  AFTER UPDATE OR DELETE ON public.business_applications
  FOR EACH ROW EXECUTE FUNCTION log_business_application_access();