-- Update community_users table to support multiple industries and new fields
ALTER TABLE public.community_users 
ADD COLUMN industries TEXT[] DEFAULT '{}',
ADD COLUMN business_stage TEXT,
ADD COLUMN about_you TEXT;

-- Update existing records to move single industry to industries array
UPDATE public.community_users 
SET industries = ARRAY[industry] 
WHERE industry IS NOT NULL AND industries = '{}';

-- Make industries column not null with default
ALTER TABLE public.community_users 
ALTER COLUMN industries SET NOT NULL,
ALTER COLUMN industries SET DEFAULT '{}';