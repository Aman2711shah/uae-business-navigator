-- Add missing RLS policies to prevent privilege escalation in user_roles table

-- Only allow admin role assignment through secure functions
CREATE POLICY "Only system can manage user roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (false); -- Block all direct inserts

CREATE POLICY "Only system can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (false); -- Block all direct updates

CREATE POLICY "Only system can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (false); -- Block all direct deletes

-- Create secure function for admin role assignment
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to create first admin user (one-time use)
CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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