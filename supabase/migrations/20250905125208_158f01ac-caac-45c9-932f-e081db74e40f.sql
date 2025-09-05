-- Fix Security Definer View issue by recreating view with security_invoker = true
-- This ensures the view respects Row Level Security policies of the querying user

-- Drop the existing view
DROP VIEW IF EXISTS public.freezone_public_info;

-- Recreate the view with security_invoker = true (available in PostgreSQL 15+)
-- This makes the view respect RLS policies of the invoking user, not the view creator
CREATE VIEW public.freezone_public_info
WITH (security_invoker = true) AS 
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

-- Grant appropriate permissions (safe since view now respects RLS)
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;