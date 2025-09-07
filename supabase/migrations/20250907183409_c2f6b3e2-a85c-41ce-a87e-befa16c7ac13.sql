-- Fix critical security issue: Payment Information Could Be Accessed by Unauthorized Users
-- Enable RLS on application_payment_status table and implement proper access controls

-- Enable Row Level Security on the application_payment_status table
ALTER TABLE public.application_payment_status ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admins can view all payment information for administrative purposes
CREATE POLICY "Admins can view all payment information" 
ON public.application_payment_status 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy 2: Users can only view payment information for their own submissions
-- This links through the onboarding_submissions table to verify ownership
CREATE POLICY "Users can view their own payment information" 
ON public.application_payment_status 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.onboarding_submissions os 
    WHERE os.request_id = application_payment_status.request_id 
    AND os.user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

-- Policy 3: Edge functions can insert/update payment status data using service role
-- This allows the payment processing system to update payment information
CREATE POLICY "Service role can manage payment information" 
ON public.application_payment_status 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add comment explaining the security model
COMMENT ON TABLE public.application_payment_status IS 
'Contains sensitive payment information. Access is restricted to: (1) Admins for management, (2) Users for their own payment data only, (3) Service role for payment processing updates.';