-- Add payment-related columns to submissions table
ALTER TABLE public.submissions
ADD COLUMN payment_status text DEFAULT 'unpaid',
ADD COLUMN payment_intent_id text,
ADD COLUMN payment_amount numeric(12,2),
ADD COLUMN payment_currency text,
ADD COLUMN payment_metadata jsonb;