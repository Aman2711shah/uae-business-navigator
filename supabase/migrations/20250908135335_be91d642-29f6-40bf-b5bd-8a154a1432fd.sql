-- Fix critical RLS security vulnerabilities

-- 1. Fix onboarding_submissions RLS policy - remove dangerous OR condition
DROP POLICY IF EXISTS "Users can view their own onboarding submissions" ON public.onboarding_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions by request_id" ON public.onboarding_submissions;
DROP POLICY IF EXISTS "Users can view payment status for submissions they own" ON public.onboarding_submissions;

-- Create secure RLS policy for onboarding_submissions
CREATE POLICY "Users can view their own onboarding submissions" 
ON public.onboarding_submissions 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Remove duplicate chat_logs RLS policies and keep only the strict ones
DROP POLICY IF EXISTS "Users can create their own chat logs" ON public.chat_logs;
DROP POLICY IF EXISTS "Users can view their own chat logs" ON public.chat_logs;

-- 3. Secure profiles table - ensure no unauthorized access to PII
DROP POLICY IF EXISTS "Users can only view their own complete profile" ON public.profiles;

CREATE POLICY "Users can view their own profile data" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Strengthen Stripe payment data policies - ensure metadata is always required
DROP POLICY IF EXISTS "Users can view their own checkout sessions via metadata" ON public.stripe_checkout_sessions;
DROP POLICY IF EXISTS "Users can view their own charges via metadata" ON public.stripe_charges;

CREATE POLICY "Users can view their own checkout sessions" 
ON public.stripe_checkout_sessions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      metadata IS NOT NULL 
      AND (
        (metadata->>'user_id')::uuid = auth.uid()
        OR (
          metadata->>'email' = (
            SELECT email FROM auth.users WHERE id = auth.uid()
          )
        )
        OR EXISTS (
          SELECT 1 FROM onboarding_submissions os
          WHERE os.request_id = metadata->>'requestId'
          AND os.user_id = auth.uid()
        )
      )
    )
  )
);

CREATE POLICY "Users can view their own charges" 
ON public.stripe_charges 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      metadata IS NOT NULL 
      AND (
        (metadata->>'user_id')::uuid = auth.uid()
        OR (
          metadata->>'email' = (
            SELECT email FROM auth.users WHERE id = auth.uid()
          )
        )
        OR EXISTS (
          SELECT 1 FROM onboarding_submissions os
          WHERE os.request_id = metadata->>'requestId'
          AND os.user_id = auth.uid()
        )
      )
    )
  )
);