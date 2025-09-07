-- Fix security issues by recreating the view with proper security
DROP VIEW IF EXISTS public.application_payment_status;

-- Create a secure function to get application payment status
CREATE OR REPLACE FUNCTION public.get_application_payment_status(p_request_id text)
RETURNS TABLE (
  request_id text,
  user_name text,
  user_email text,
  submission_status text,
  submission_created timestamptz,
  checkout_session_id text,
  checkout_status text,
  checkout_amount bigint,
  checkout_currency text,
  checkout_created timestamptz,
  payment_intent_id text,
  payment_status text,
  charge_id text,
  charge_amount bigint,
  charge_currency text,
  charge_status text,
  charge_created timestamptz
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
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
  WHERE os.request_id = p_request_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_application_payment_status(text) TO authenticated;

-- Create a simpler view without security definer
CREATE VIEW public.application_payment_status AS
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
LEFT JOIN public.stripe_charges c ON c.payment_intent = pi.id;

-- Add policies for the Stripe tables
CREATE POLICY "Service role can manage stripe checkout sessions" ON public.stripe_checkout_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage stripe payment intents" ON public.stripe_payment_intents
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage stripe charges" ON public.stripe_charges
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON public.application_payment_status TO authenticated;