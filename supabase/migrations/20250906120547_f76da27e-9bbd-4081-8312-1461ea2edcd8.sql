-- Add columns needed for submit-application function
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS request_id text UNIQUE,
ADD COLUMN IF NOT EXISTS user_email text,
ADD COLUMN IF NOT EXISTS user_name text,
ADD COLUMN IF NOT EXISTS payload jsonb;