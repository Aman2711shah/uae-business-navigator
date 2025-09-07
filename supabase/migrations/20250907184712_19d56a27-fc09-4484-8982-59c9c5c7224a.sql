-- Security Enhancement: Fix remaining function search paths only
-- The freezones policies already exist, so let's just fix the functions

-- Update has_role function to have explicit search_path (use CASCADE since it has dependencies)
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update log_security_event function to have explicit search_path
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
SET search_path = 'public'
AS $$
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
$$;

-- Update handle_new_user function to have explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, uuid, text, text, jsonb, text) TO authenticated;