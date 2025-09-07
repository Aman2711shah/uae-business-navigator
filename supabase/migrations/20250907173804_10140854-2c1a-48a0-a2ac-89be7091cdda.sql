-- Drop the existing foreign table first
DROP FOREIGN TABLE IF EXISTS public.stripe_charges CASCADE;

-- Create regular Stripe tables for manual data management
CREATE TABLE public.stripe_charges (
  id text PRIMARY KEY,
  amount bigint,
  currency text,
  status text,
  payment_intent text,
  customer text,
  description text,
  created timestamp with time zone,
  metadata jsonb
);

-- Enable RLS
ALTER TABLE public.stripe_charges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Stripe charges are readable by authenticated users" ON public.stripe_charges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage stripe charges" ON public.stripe_charges
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create payment intents table
CREATE TABLE public.stripe_payment_intents (
  id text PRIMARY KEY,
  amount bigint,
  currency text,
  status text,
  metadata jsonb,
  created timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.stripe_payment_intents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Payment intents are readable by authenticated users" ON public.stripe_payment_intents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage payment intents" ON public.stripe_payment_intents
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create checkout sessions table
CREATE TABLE public.stripe_checkout_sessions (
  id text PRIMARY KEY,
  payment_intent text,
  customer text,
  metadata jsonb,
  amount_subtotal bigint,
  amount_total bigint,
  currency text,
  status text,
  created timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.stripe_checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Checkout sessions are readable by authenticated users" ON public.stripe_checkout_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage checkout sessions" ON public.stripe_checkout_sessions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create the application_payment_status view
CREATE OR REPLACE VIEW public.application_payment_status AS
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

-- Grant permissions
GRANT SELECT ON public.application_payment_status TO authenticated;
GRANT SELECT ON public.stripe_charges TO authenticated;
GRANT SELECT ON public.stripe_payment_intents TO authenticated;
GRANT SELECT ON public.stripe_checkout_sessions TO authenticated;

-- Create indexes for better performance (fixed syntax)
CREATE INDEX IF NOT EXISTS idx_stripe_checkout_sessions_metadata_request_id 
ON public.stripe_checkout_sessions USING BTREE ((metadata->>'requestId'));

CREATE INDEX IF NOT EXISTS idx_stripe_charges_payment_intent 
ON public.stripe_charges (payment_intent);

CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_id 
ON public.stripe_payment_intents (id);

-- Create GIN index on JSONB columns
CREATE INDEX IF NOT EXISTS idx_stripe_checkout_sessions_metadata 
ON public.stripe_checkout_sessions USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_metadata 
ON public.stripe_payment_intents USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_stripe_charges_metadata 
ON public.stripe_charges USING GIN (metadata);