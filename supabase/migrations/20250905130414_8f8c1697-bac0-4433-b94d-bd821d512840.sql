-- Fix Customer Email Addresses exposure in freezone_info table
-- Restrict contact information access to admins only

-- Drop the existing broad policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view basic freezone info" ON public.freezone_info;
DROP POLICY IF EXISTS "Public can view basic freezone info only" ON public.freezone_info;

-- Create a restricted policy for authenticated users that excludes contact info
-- Note: We can't use column-level security in policies, so we'll rely on the view
-- for non-admin access and restrict the main table to admin-only access

-- Only admins can access the main freezone_info table with full contact details
-- Non-admin users should use the freezone_public_info view instead

-- Revoke direct access to the main table for non-admins
REVOKE ALL ON public.freezone_info FROM PUBLIC;
REVOKE ALL ON public.freezone_info FROM authenticated;
REVOKE ALL ON public.freezone_info FROM anon;

-- Ensure the public view is accessible to authenticated and anonymous users
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;

-- Add a comment to document the security approach
COMMENT ON TABLE public.freezone_info IS 'Contains sensitive contact information. Only accessible to admins. Use freezone_public_info view for public/authenticated access.';