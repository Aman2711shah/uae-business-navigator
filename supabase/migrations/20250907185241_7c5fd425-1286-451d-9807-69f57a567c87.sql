-- Add missing RLS policies for security hardening

-- Add RLS policies for freezone_info table
CREATE POLICY "Freezone info is publicly readable" 
ON public.freezone_info 
FOR SELECT 
USING (true);

-- Add RLS policies for security_events table (admin access only)
CREATE POLICY "Only admins can view security events" 
ON public.security_events 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Grant necessary permissions for security logging
GRANT INSERT ON public.security_events TO authenticated;
GRANT SELECT ON public.security_events TO authenticated;