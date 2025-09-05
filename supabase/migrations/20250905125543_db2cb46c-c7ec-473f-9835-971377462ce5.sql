-- Fix Security Event Logs exposure by restricting access to admins only
-- Drop any existing policies to ensure clean slate
DROP POLICY IF EXISTS "Admins can manage security events" ON public.security_events;

-- Revoke any public access to the table
REVOKE ALL ON public.security_events FROM PUBLIC;
REVOKE ALL ON public.security_events FROM authenticated;
REVOKE ALL ON public.security_events FROM anon;

-- Create explicit admin-only policies for all operations
CREATE POLICY "Admin only - can select security events" 
ON public.security_events 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can insert security events" 
ON public.security_events 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can update security events" 
ON public.security_events 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin only - can delete security events" 
ON public.security_events 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure the log_security_event function can still work by granting minimal necessary permissions
-- This function is SECURITY DEFINER so it will run with elevated privileges
GRANT INSERT ON public.security_events TO authenticator;