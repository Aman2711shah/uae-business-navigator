-- Fix security definer view issue by dropping the view and using direct queries instead
DROP VIEW IF EXISTS public.post_author_info;

-- The RLS policies we created are sufficient for security
-- No need for a separate view, components will query the table directly with proper RLS