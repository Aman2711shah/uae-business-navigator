-- Critical Security Fix: Make user_id columns NOT NULL to prevent RLS bypass
-- This ensures all user-specific data is properly associated with authenticated users

-- Fix applications table
ALTER TABLE public.applications 
ALTER COLUMN user_id SET NOT NULL;

-- Fix service_requests table  
ALTER TABLE public.service_requests
ALTER COLUMN user_id SET NOT NULL;

-- Fix user_feedback table
ALTER TABLE public.user_feedback
ALTER COLUMN user_id SET NOT NULL;

-- Fix chat_logs table
ALTER TABLE public.chat_logs
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraints for better data integrity
-- (Note: We cannot reference auth.users directly, but we can add comments for clarity)

-- Add indexes for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON public.chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);

-- Note: security_events.user_id should remain nullable as some security events 
-- may occur without a specific user context (e.g., anonymous attacks)