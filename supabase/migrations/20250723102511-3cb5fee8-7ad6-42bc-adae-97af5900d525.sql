-- Fix security warnings by updating function search paths

-- Update existing functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.create_initial_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;