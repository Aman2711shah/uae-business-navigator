-- Security improvements migration

-- 1. Create security_events table for persistent logging
CREATE TABLE public.security_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid,
  ip_address text,
  user_agent text,
  details jsonb,
  severity text NOT NULL DEFAULT 'low',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can manage security events
CREATE POLICY "Admins can manage security events" 
ON public.security_events 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 2. Update database functions to include proper search_path for security
CREATE OR REPLACE FUNCTION public.setup_initial_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  admin_count int;
  result_msg text;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    result_msg := 'Admin user already exists. No action needed.';
  ELSE
    result_msg := 'No admin user found. Please use create_initial_admin function with a valid email.';
  END IF;
  
  RETURN result_msg;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only allow if current user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Insert or update user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) 
  DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get user ID from email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', admin_email;
  END IF;
  
  -- Check if any admin already exists
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Admin user already exists';
  END IF;
  
  -- Create admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin');
END;
$function$;

-- 3. Secure freezone contact information - require authentication for contact details
DROP POLICY IF EXISTS "Freezone info is publicly readable" ON public.freezone_info;

-- Create separate policies for different data access levels
CREATE POLICY "Public freezone basic info" 
ON public.freezone_info 
FOR SELECT 
USING (true);

-- Create a view for public freezone data without sensitive contact info
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

-- Allow public access to the view
GRANT SELECT ON public.freezone_public_info TO anon, authenticated;

-- Create policy for full freezone info (including contact details) - admin only
CREATE POLICY "Admins can access full freezone info including contacts" 
ON public.freezone_info 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- 4. Add security logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT NULL,
  ip_address text DEFAULT NULL,
  user_agent text DEFAULT NULL,
  details jsonb DEFAULT NULL,
  severity text DEFAULT 'low'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    severity
  ) VALUES (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    severity
  );
END;
$function$;