-- Fix critical security vulnerability: Remove public access to leads table
-- and restrict to admin users only

-- Drop the dangerous policy that allows all authenticated users to read leads
DROP POLICY IF EXISTS "Leads are readable by authenticated users" ON public.leads;

-- The table already has these secure policies:
-- 1. "Admins can manage all leads" - allows admins full access (GOOD)
-- 2. "Anyone can submit leads" - allows form submissions (NECESSARY for functionality)

-- Add a comment to document the security decision
COMMENT ON TABLE public.leads IS 'Contains sensitive customer contact information. Access restricted to admin users only for privacy protection.';

-- Verify that only these policies remain:
-- 1. Admins can manage all leads (SELECT, INSERT, UPDATE, DELETE for admins)
-- 2. Anyone can submit leads (INSERT only for form submissions)

-- Remove any grants that might allow broader access
REVOKE SELECT ON public.leads FROM authenticated;
REVOKE SELECT ON public.leads FROM anon;