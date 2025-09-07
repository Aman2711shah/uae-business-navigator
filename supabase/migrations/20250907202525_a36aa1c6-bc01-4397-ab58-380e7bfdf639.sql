-- Fix remaining database function security vulnerabilities
-- Update functions that still need proper search_path settings

-- Update generate_request_id function with proper security settings
CREATE OR REPLACE FUNCTION public.generate_request_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  date_part text;
  random_part text;
  request_id text;
  id_exists boolean;
BEGIN
  -- Generate date part (YYYYMMDD format)
  date_part := to_char(now(), 'YYYYMMDD');
  
  -- Try to generate a unique ID
  LOOP
    -- Generate 4-digit random number
    random_part := lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Combine parts
    request_id := 'WZT-' || date_part || '-' || random_part;
    
    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM onboarding_submissions WHERE request_id = request_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN request_id;
END;
$$;

-- Update handle_new_user function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Update assign_user_role function with proper security settings
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Update create_initial_admin function with proper security settings
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Update setup_initial_admin function with proper security settings
CREATE OR REPLACE FUNCTION public.setup_initial_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Update check_admin_exists function with proper security settings
CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
END;
$$;