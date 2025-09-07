-- Create Stripe wrapper configuration
CREATE EXTENSION IF NOT EXISTS wrappers;

-- Create stripe schema
CREATE SCHEMA IF NOT EXISTS stripe;

-- Create the Stripe wrapper
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_foreign_data_wrapper WHERE fdwname = 'stripe_wrapper') THEN
    CREATE FOREIGN DATA WRAPPER stripe_wrapper
      HANDLER stripe_fdw_handler
      VALIDATOR stripe_fdw_validator;
  END IF;
END $$;

-- Create server using the secret key
DO $$
DECLARE
  -- For new wrappers, we use Vault directly
  v_api_key_id text;
BEGIN
  -- Check wrappers version to determine approach
  IF (SELECT extversion FROM pg_extension WHERE extname = 'wrappers') IN (
    '0.1.0', '0.1.1', '0.1.4', '0.1.5', '0.1.6', '0.1.7', '0.1.8', '0.1.9',
    '0.1.10', '0.1.11', '0.1.12', '0.1.14', '0.1.15', '0.1.16', '0.1.17',
    '0.1.18', '0.1.19', '0.2.0', '0.3.0', '0.3.1', '0.4.0', '0.4.1',
    '0.4.2', '0.4.3', '0.4.4', '0.4.5'
  ) THEN
    -- Old wrappers approach with pgsodium
    CREATE EXTENSION IF NOT EXISTS pgsodium;
    
    PERFORM pgsodium.create_key(
      name := 'stripe_wrapper_api_key_id'
    );
    
    SELECT id INTO v_api_key_id FROM pgsodium.valid_key WHERE name = 'stripe_wrapper_api_key_id' LIMIT 1;
  ELSE
    -- New wrappers approach with vault directly
    SELECT id INTO v_api_key_id FROM vault.secrets WHERE name = 'STRIPE_SECRET_KEY' LIMIT 1;
  END IF;
  
  IF v_api_key_id IS NULL THEN
    RAISE EXCEPTION 'Could not find or create API key for Stripe wrapper';
  END IF;
  
  -- Drop server if exists and recreate
  DROP SERVER IF EXISTS stripe_server CASCADE;
  
  -- Create the server
  EXECUTE format(
    'CREATE SERVER stripe_server FOREIGN DATA WRAPPER stripe_wrapper OPTIONS (api_key_id ''%s'', api_url ''https://api.stripe.com/v1'')',
    v_api_key_id
  );
END $$;

-- Create foreign tables in stripe schema
CREATE FOREIGN TABLE stripe.charges (
  id text,
  amount bigint,
  currency text,
  status text,
  payment_intent text,
  customer text,
  invoice text,
  description text,
  created bigint,
  attrs jsonb
)
SERVER stripe_server
OPTIONS (
  object 'charges',
  rowid_column 'id'
);

CREATE FOREIGN TABLE stripe.payment_intents (
  id text,
  amount bigint,
  currency text,
  status text,
  metadata jsonb,
  created bigint
)
SERVER stripe_server
OPTIONS (
  object 'payment_intents',
  rowid_column 'id'
);

CREATE FOREIGN TABLE stripe.checkout_sessions (
  id text,
  payment_intent text,
  customer text,
  metadata jsonb,
  amount_subtotal bigint,
  amount_total bigint,
  currency text,
  status text,
  created bigint
)
SERVER stripe_server
OPTIONS (
  object 'checkout/sessions',
  rowid_column 'id'
);

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
  to_timestamp(cs.created) as checkout_created,
  pi.id as payment_intent_id,
  pi.status as payment_status,
  c.id as charge_id,
  c.amount as charge_amount,
  c.currency as charge_currency,
  c.status as charge_status,
  to_timestamp(c.created) as charge_created
FROM public.onboarding_submissions os
LEFT JOIN stripe.checkout_sessions cs ON cs.metadata->>'requestId' = os.request_id
LEFT JOIN stripe.payment_intents pi ON pi.id = cs.payment_intent
LEFT JOIN stripe.charges c ON c.payment_intent = pi.id;

-- Grant permissions
GRANT SELECT ON public.application_payment_status TO authenticated;
GRANT USAGE ON SCHEMA stripe TO authenticated;
GRANT SELECT ON stripe.charges TO authenticated;
GRANT SELECT ON stripe.payment_intents TO authenticated;
GRANT SELECT ON stripe.checkout_sessions TO authenticated;