-- Fix security issue: Add RLS policies to freezone_public_info table
-- This table is used for public freezone information display and should be publicly readable

-- Enable RLS on the freezone_public_info table
ALTER TABLE public.freezone_public_info ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to freezone public information
-- This matches the security model of the main freezone_info table
CREATE POLICY "Freezone public info is publicly readable" 
ON public.freezone_public_info 
FOR SELECT 
USING (true);

-- Restrict write access - only authenticated users should be able to modify this data
-- (though in practice, this data should be managed through admin interfaces)
CREATE POLICY "Only authenticated users can modify freezone public info" 
ON public.freezone_public_info 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);