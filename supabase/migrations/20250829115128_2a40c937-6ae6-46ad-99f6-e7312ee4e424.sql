-- Fix Security Definer View Issue
-- Remove SECURITY DEFINER from the freezone_public_info view to address security linter warning

-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.freezone_public_info;

-- Create view without SECURITY DEFINER (uses invoker's permissions)
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
    -- Explicitly excluding contact_email and contact_phone for security
FROM public.freezone_info;

-- Grant appropriate permissions (this is safe since view excludes sensitive data)
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;