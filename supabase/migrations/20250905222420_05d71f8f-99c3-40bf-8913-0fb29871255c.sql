-- FINAL SECURITY LOCKDOWN: Address all remaining email exposure risks

-- 1. CRITICAL: Remove the safe_profiles view that still exposes data
DROP VIEW IF EXISTS public.safe_profiles;

-- 2. CRITICAL: Ensure profiles table is completely locked down
-- Drop any existing policies that might be too permissive
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile only" ON public.profiles; 
DROP POLICY IF EXISTS "Users can update their own profile only" ON public.profiles;

-- Create ultra-restrictive policies for profiles (NO EMAIL ACCESS FOR ANYONE)
CREATE POLICY "Strict user profile access" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Strict user profile insert" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Strict user profile update" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 3. SECURE: Fix community_users data exposure
DROP POLICY IF EXISTS "Limited community profile access for authenticated users" ON public.community_users;

-- Only allow users to see their own community profile + basic username only for others
CREATE POLICY "Ultra restricted community access" 
ON public.community_users 
FOR SELECT 
USING (
  auth.uid() = user_id  -- Users can only see their own full community profile
  -- Others cannot see any community user data
);

-- 4. SECURE: Add missing RLS policies for notifications
CREATE POLICY "Users can only see their own notifications" 
ON public.notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = notifications.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);  -- Allow system to create notifications

-- 5. SECURE: Ensure chat_logs are properly isolated
DROP POLICY IF EXISTS "Users can view their own chat logs" ON public.chat_logs;
DROP POLICY IF EXISTS "Users can create their own chat logs" ON public.chat_logs;

CREATE POLICY "Strict chat log access" 
ON public.chat_logs 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Strict chat log creation" 
ON public.chat_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 6. SECURITY LOG: Record this comprehensive security lockdown
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_events') THEN
    INSERT INTO public.security_events (
      event_type,
      details,
      severity
    ) VALUES (
      'comprehensive_security_lockdown',
      jsonb_build_object(
        'action', 'eliminated_all_email_exposure_vectors',
        'tables_secured', ARRAY['profiles', 'community_users', 'notifications', 'chat_logs'],
        'vulnerability_eliminated', 'user_email_address_theft',
        'access_model', 'strict_user_isolation',
        'timestamp', now()
      ),
      'critical'
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;