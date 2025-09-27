-- Fix security issue: Secure business_applications table with proper RLS policies
-- This table contains sensitive customer data (emails, phone numbers) and needs proper access control

-- Ensure RLS is enabled
ALTER TABLE public.business_applications ENABLE ROW LEVEL SECURITY;

-- Create admin-only read access policy (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_applications' 
        AND policyname = 'Admins can view all business applications'
    ) THEN
        CREATE POLICY "Admins can view all business applications" 
        ON public.business_applications 
        FOR SELECT 
        TO authenticated
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Create admin-only update access policy (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_applications' 
        AND policyname = 'Admins can update business applications'
    ) THEN
        CREATE POLICY "Admins can update business applications" 
        ON public.business_applications 
        FOR UPDATE 
        TO authenticated
        USING (has_role(auth.uid(), 'admin'::app_role))
        WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Create admin-only delete access policy (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_applications' 
        AND policyname = 'Admins can delete business applications'
    ) THEN
        CREATE POLICY "Admins can delete business applications" 
        ON public.business_applications 
        FOR DELETE 
        TO authenticated
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;