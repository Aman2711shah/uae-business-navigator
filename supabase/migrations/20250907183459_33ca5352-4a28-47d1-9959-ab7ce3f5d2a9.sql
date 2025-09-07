-- Fix critical security issue: Payment Information Could Be Accessed by Unauthorized Users
-- Since application_payment_status is a view, we need to drop it and recreate it as a secure function
-- that respects user permissions and only returns data users are authorized to see

-- Drop the existing view
DROP VIEW IF EXISTS public.application_payment_status;

-- Create a secure function that replaces the view functionality
-- This function will only return payment information that the user is authorized to see
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
    -- If specific request_id is provided, filter by it
    (p_request_id IS NULL OR os.request_id = p_request_id)
    AND (
      -- Allow admins to see all payment information
      public.has_role(auth.uid(), 'admin'::app_role)
      OR 
      -- Allow users to see only their own payment information
      (os.user_id = auth.uid() AND auth.uid() IS NOT NULL)
    )
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_application_payment_status_secure(text) TO authenticated;

-- Create an admin-only function for full access (existing function)
-- Keep the existing get_application_payment_status function but restrict it to admins
DROP FUNCTION IF EXISTS public.get_application_payment_status(text);

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
  -- Only allow admins to use this function
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

-- Grant execute permission only to authenticated users (admin check is inside function)
GRANT EXECUTE ON FUNCTION public.get_application_payment_status_admin(text) TO authenticated;

-- Add comments explaining the security model
COMMENT ON FUNCTION public.get_application_payment_status_secure(text) IS 
'Secure function to get payment status information. Users can only access their own payment data, admins can access all data.';

COMMENT ON FUNCTION public.get_application_payment_status_admin(text) IS 
'Admin-only function to get payment status information. Requires admin role to return any data.';