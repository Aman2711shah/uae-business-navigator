-- Fix security issues
-- 1. Remove SECURITY DEFINER from the view
DROP VIEW IF EXISTS public.application_payment_status;

-- Create the application_payment_status view without SECURITY DEFINER
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

-- Create RLS policy for the view that allows authenticated users to see data
-- where they have permission to see the onboarding submission
CREATE POLICY "Users can view payment status for submissions they own" ON public.onboarding_submissions
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Grant view access to authenticated users
GRANT SELECT ON public.application_payment_status TO authenticated;