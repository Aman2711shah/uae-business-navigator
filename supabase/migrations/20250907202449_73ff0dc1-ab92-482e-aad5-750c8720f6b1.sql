-- Priority 1: Secure the leads table - CRITICAL DATA PROTECTION
-- Remove the overly permissive policy that allows anyone to view leads
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

-- Add proper RLS policies for the leads table
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view leads" 
ON public.leads 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Priority 2: Fix database function security vulnerabilities
-- Update has_role function with proper security settings
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update log_security_event function with proper security settings
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text, 
  user_id uuid DEFAULT NULL::uuid, 
  ip_address text DEFAULT NULL::text, 
  user_agent text DEFAULT NULL::text, 
  details jsonb DEFAULT NULL::jsonb, 
  severity text DEFAULT 'low'::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update get_current_user_profile function with proper security settings
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  display_name text, 
  headline text, 
  bio text, 
  services text[], 
  avatar_url text, 
  email text, 
  full_name text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.headline,
    p.bio,
    p.services,
    p.avatar_url,
    p.email,
    p.full_name,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = auth.uid() 
    AND auth.uid() IS NOT NULL;
$$;

-- Update can_view_profile_field function with proper security settings
CREATE OR REPLACE FUNCTION public.can_view_profile_field(profile_user_id uuid, field_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE 
    WHEN field_name IN ('email', 'full_name') THEN 
      auth.uid() = profile_user_id AND auth.uid() IS NOT NULL
    ELSE 
      true -- Public fields like display_name, bio, etc.
  END;
$$;

-- Update get_application_payment_status_secure function with proper security settings
CREATE OR REPLACE FUNCTION public.get_application_payment_status_secure(p_request_id text DEFAULT NULL::text)
RETURNS TABLE(
  request_id text, 
  user_name text, 
  user_email text, 
  submission_status text, 
  submission_created timestamp with time zone, 
  checkout_session_id text, 
  checkout_status text, 
  checkout_amount bigint, 
  checkout_currency text, 
  checkout_created timestamp with time zone, 
  payment_intent_id text, 
  payment_status text, 
  charge_id text, 
  charge_amount bigint, 
  charge_currency text, 
  charge_status text, 
  charge_created timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    os.request_id,
    os.user_name,
    os.user_email,
    os.status as submission_status,
    os.created_at as submission_created,
    cs.id as checkout_session_id,
    cs.status as checkout_status,
    cs.amount_total as checkout_amount,
    cs.currency as checkout_currency,
    cs.created as checkout_created,
    pi.id as payment_intent_id,
    pi.status as payment_status,
    c.id as charge_id,
    c.amount as charge_amount,
    c.currency as charge_currency,
    c.status as charge_status,
    c.created as charge_created
  FROM public.onboarding_submissions os
  LEFT JOIN public.stripe_checkout_sessions cs ON cs.metadata->>'requestId' = os.request_id
  LEFT JOIN public.stripe_payment_intents pi ON pi.id = cs.payment_intent
  LEFT JOIN public.stripe_charges c ON c.payment_intent = pi.id
  WHERE (
    (p_request_id IS NULL OR os.request_id = p_request_id)
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR 
      (os.user_id = auth.uid() AND auth.uid() IS NOT NULL)
    )
  );
$$;

-- Update get_application_payment_status_admin function with proper security settings
CREATE OR REPLACE FUNCTION public.get_application_payment_status_admin(p_request_id text)
RETURNS TABLE(
  request_id text, 
  user_name text, 
  user_email text, 
  submission_status text, 
  submission_created timestamp with time zone, 
  checkout_session_id text, 
  checkout_status text, 
  checkout_amount bigint, 
  checkout_currency text, 
  checkout_created timestamp with time zone, 
  payment_intent_id text, 
  payment_status text, 
  charge_id text, 
  charge_amount bigint, 
  charge_currency text, 
  charge_status text, 
  charge_created timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    os.request_id,
    os.user_name,
    os.user_email,
    os.status as submission_status,
    os.created_at as submission_created,
    cs.id as checkout_session_id,
    cs.status as checkout_status,
    cs.amount_total as checkout_amount,
    cs.currency as checkout_currency,
    cs.created as checkout_created,
    pi.id as payment_intent_id,
    pi.status as payment_status,
    c.id as charge_id,
    c.amount as charge_amount,
    c.currency as charge_currency,
    c.status as charge_status,
    c.created as charge_created
  FROM public.onboarding_submissions os
  LEFT JOIN public.stripe_checkout_sessions cs ON cs.metadata->>'requestId' = os.request_id
  LEFT JOIN public.stripe_payment_intents pi ON pi.id = cs.payment_intent
  LEFT JOIN public.stripe_charges c ON c.payment_intent = pi.id
  WHERE os.request_id = p_request_id
    AND public.has_role(auth.uid(), 'admin'::app_role);
$$;