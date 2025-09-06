-- Remove the security definer property from the view
ALTER VIEW public.safe_profiles SET (security_barrier = false);

-- Instead, create RLS policies on the view itself would be better but let's just remove the view
-- and update our application code to use explicit column selection instead
DROP VIEW IF EXISTS public.safe_profiles;