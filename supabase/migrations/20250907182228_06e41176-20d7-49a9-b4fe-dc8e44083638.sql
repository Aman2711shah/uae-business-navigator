-- Fix Security Definer View issue by removing SECURITY DEFINER from function
-- and ensuring proper RLS policies are in place

-- Drop the existing function with SECURITY DEFINER
DROP FUNCTION IF EXISTS public.get_application_payment_status(text);

-- Recreate the function without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE OR REPLACE FUNCTION public.get_application_payment_status(p_request_id text)
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
  WHERE os.request_id = p_request_id;
$$;

-- Ensure proper permissions for the function
GRANT EXECUTE ON FUNCTION public.get_application_payment_status(text) TO authenticated;

-- Make sure RLS policies allow users to see their own submission data
-- (This should already be in place, but let's ensure it's correct)
DROP POLICY IF EXISTS "Users can view their own submissions by request_id" ON public.onboarding_submissions;
CREATE POLICY "Users can view their own submissions by request_id" ON public.onboarding_submissions
  FOR SELECT USING (
    user_id = auth.uid() 
    OR user_id IS NULL  -- Allow anonymous submissions to be viewed
  );