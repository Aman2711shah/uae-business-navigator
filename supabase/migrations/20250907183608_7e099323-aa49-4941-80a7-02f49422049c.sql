-- Fix security linter warnings from the previous migration

-- Fix WARN: Function Search Path Mutable for get_application_payment_status_secure
-- Already has search_path set, but let's ensure it's properly set for both functions
DROP FUNCTION IF EXISTS public.get_application_payment_status_secure(text);

CREATE OR REPLACE FUNCTION public.get_application_payment_status_secure(p_request_id text DEFAULT NULL)
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
STABLE 
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix the admin function as well
DROP FUNCTION IF EXISTS public.get_application_payment_status_admin(text);

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
STABLE 
SECURITY DEFINER
SET search_path = 'public'
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_application_payment_status_secure(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_application_payment_status_admin(text) TO authenticated;