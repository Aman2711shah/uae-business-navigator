-- Fix Customer Contact Information exposure with proper RLS policies
-- Ensure freezone_info table is properly secured with admin-only access

-- Ensure Row Level Security is enabled
ALTER TABLE public.freezone_info ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "Admins can access full freezone info including contacts" ON public.freezone_info;
DROP POLICY IF EXISTS "Admins can manage freezone info" ON public.freezone_info;

-- Create explicit admin-only policies for all operations
CREATE POLICY "Admin only - can select freezone info with contacts" 
ON public.freezone_info 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can insert freezone info" 
ON public.freezone_info 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can update freezone info" 
ON public.freezone_info 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can delete freezone info" 
ON public.freezone_info 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure no default permissions exist
REVOKE ALL ON public.freezone_info FROM PUBLIC;
REVOKE ALL ON public.freezone_info FROM authenticated;
REVOKE ALL ON public.freezone_info FROM anon;

-- Grant only to authenticated role for admin functions to work
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the public view has proper access (this should already be set from previous migration)
GRANT SELECT ON public.freezone_public_info TO authenticated, anon;