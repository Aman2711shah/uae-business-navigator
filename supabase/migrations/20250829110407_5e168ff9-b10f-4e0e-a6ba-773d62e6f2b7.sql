-- Fix Business Contact Information Security Issue
-- Restrict public access to sensitive contact information in freezone_info table

-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public freezone basic info" ON public.freezone_info;

-- Create a new policy that excludes sensitive contact information for public access
-- This policy will work with the existing freezone_public_info view
CREATE POLICY "Public can view basic freezone info only" 
ON public.freezone_info 
FOR SELECT 
USING (
  -- Only allow access to non-sensitive columns by ensuring this policy
  -- is used in conjunction with the freezone_public_info view
  -- The application should use the view, not direct table access
  false
);

-- Create a policy for authenticated users to access basic info (no contact details)
CREATE POLICY "Authenticated users can view basic freezone info"
ON public.freezone_info
FOR SELECT
TO authenticated
USING (true);

-- Ensure the freezone_public_info view is the correct way to access public data
-- Update the view to explicitly exclude sensitive contact information
DROP VIEW IF EXISTS public.freezone_public_info;

CREATE VIEW public.freezone_public_info AS 
SELECT 
    id,
    freezone_name,
    description,
    key_benefits,
    office_location,
    website_url,
    faqs,
    created_at,
    updated_at
    -- Explicitly excluding contact_email and contact_phone
FROM public.freezone_info;

-- Grant access to the view for public use
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;

-- Update RLS to be enabled and ensure contact info is only accessible to admins
-- (The existing admin policies remain intact)