-- Security Fix: The freezone_public_info view is redundant and potentially confusing
-- Since it's just a simple SELECT from freezone_info (which already has proper RLS),
-- and the view doesn't add any security benefits, we should remove it to eliminate confusion

-- First, let's check the exact definition to ensure we understand what we're removing
-- The view simply selects: id, freezone_name, description, key_benefits, office_location, website_url, faqs, created_at, updated_at
-- This is redundant since freezone_info already has these columns and proper RLS policies

-- Drop the redundant view to eliminate the security confusion
DROP VIEW IF EXISTS public.freezone_public_info;

-- Create a comment to document the decision
COMMENT ON TABLE public.freezone_info IS 'Freezone information table with public read access via RLS. This replaces the redundant freezone_public_info view.';