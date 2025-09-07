-- CRITICAL SECURITY FIX: Restrict Stripe payment data access
-- Remove overly permissive policies that allow all authenticated users to see all payment data

-- Fix stripe_charges table security
DROP POLICY IF EXISTS "Stripe charges are readable by authenticated users" ON public.stripe_charges;

CREATE POLICY "Only admins can view all charges" 
ON public.stripe_charges 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own charges via metadata" 
ON public.stripe_charges 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Check if user_id is in metadata
    (metadata->>'user_id')::uuid = auth.uid() OR
    -- Check if email in metadata matches user's email
    (metadata->>'email') = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    -- Check if request_id in metadata matches user's submissions
    EXISTS (
      SELECT 1 FROM public.onboarding_submissions os 
      WHERE os.request_id = (metadata->>'requestId') 
      AND os.user_id = auth.uid()
    )
  )
);

-- Fix stripe_checkout_sessions table security
DROP POLICY IF EXISTS "Checkout sessions are readable by authenticated users" ON public.stripe_checkout_sessions;

CREATE POLICY "Only admins can view all checkout sessions" 
ON public.stripe_checkout_sessions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own checkout sessions via metadata" 
ON public.stripe_checkout_sessions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Check if user_id is in metadata
    (metadata->>'user_id')::uuid = auth.uid() OR
    -- Check if email in metadata matches user's email
    (metadata->>'email') = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    -- Check if request_id in metadata matches user's submissions
    EXISTS (
      SELECT 1 FROM public.onboarding_submissions os 
      WHERE os.request_id = (metadata->>'requestId') 
      AND os.user_id = auth.uid()
    )
  )
);

-- Fix stripe_payment_intents table security
DROP POLICY IF EXISTS "Payment intents are readable by authenticated users" ON public.stripe_payment_intents;

CREATE POLICY "Only admins can view all payment intents" 
ON public.stripe_payment_intents 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own payment intents via metadata" 
ON public.stripe_payment_intents 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Check if user_id is in metadata
    (metadata->>'user_id')::uuid = auth.uid() OR
    -- Check if email in metadata matches user's email
    (metadata->>'email') = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    -- Check if request_id in metadata matches user's submissions
    EXISTS (
      SELECT 1 FROM public.onboarding_submissions os 
      WHERE os.request_id = (metadata->>'requestId') 
      AND os.user_id = auth.uid()
    )
  )
);

-- Edge functions still need INSERT/UPDATE access for webhook processing
CREATE POLICY "Edge functions can insert charges" 
ON public.stripe_charges 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update charges" 
ON public.stripe_charges 
FOR UPDATE 
USING (true);

CREATE POLICY "Edge functions can insert checkout sessions" 
ON public.stripe_checkout_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update checkout sessions" 
ON public.stripe_checkout_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Edge functions can insert payment intents" 
ON public.stripe_payment_intents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update payment intents" 
ON public.stripe_payment_intents 
FOR UPDATE 
USING (true);