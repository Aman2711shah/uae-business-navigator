-- Fix Security Definer View issue
-- Drop and recreate the freezone_public_info view without SECURITY DEFINER

-- Drop the existing view
DROP VIEW IF EXISTS public.freezone_public_info;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
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
FROM public.freezone_info;

-- Ensure the view respects RLS by granting appropriate permissions
-- The underlying table already has RLS policies that allow public access to basic info
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;