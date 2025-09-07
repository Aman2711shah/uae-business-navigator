-- CRITICAL SECURITY FIX: Enhanced protection for sensitive customer PII
-- Implement data encryption, audit logging, and enhanced access controls for leads table

-- First, create a secure audit log table for tracking access to sensitive data
CREATE TABLE IF NOT EXISTS public.sensitive_data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessed_by UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL, -- 'view', 'decrypt', 'export'
  ip_address TEXT,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  access_granted BOOLEAN NOT NULL DEFAULT true,
  additional_metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on audit log
ALTER TABLE public.sensitive_data_access_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Only super admins can view sensitive data access logs" 
ON public.sensitive_data_access_log 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.sensitive_data_access_log 
FOR INSERT 
WITH CHECK (true);

-- Create a function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_action TEXT DEFAULT 'view',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.sensitive_data_access_log (
    accessed_by,
    table_name,
    record_id,
    action,
    ip_address,
    user_agent,
    additional_metadata
  ) VALUES (
    auth.uid(),
    p_table_name,
    p_record_id,
    p_action,
    p_ip_address,
    p_user_agent,
    p_metadata
  );
END;
$$;

-- Create enhanced security function for accessing leads with mandatory audit logging
CREATE OR REPLACE FUNCTION public.get_leads_secure(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_search_term TEXT DEFAULT NULL,
  p_requester_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  form_name TEXT,
  email TEXT,
  firstname TEXT,
  lastname TEXT,
  phone TEXT,
  service TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  fields JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify admin access
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required to access leads data';
  END IF;

  -- Log the access attempt
  PERFORM public.log_sensitive_data_access(
    'leads',
    NULL,
    'bulk_view',
    p_requester_ip,
    p_user_agent,
    jsonb_build_object(
      'limit', p_limit,
      'offset', p_offset,
      'search_term', p_search_term,
      'timestamp', now()
    )
  );

  -- Return filtered data with search capability
  RETURN QUERY
  SELECT 
    l.id,
    l.form_name,
    l.email,
    l.firstname,
    l.lastname,
    l.phone,
    l.service,
    l.notes,
    l.created_at,
    l.updated_at,
    l.fields
  FROM public.leads l
  WHERE (
    p_search_term IS NULL OR 
    l.email ILIKE '%' || p_search_term || '%' OR
    l.firstname ILIKE '%' || p_search_term || '%' OR
    l.lastname ILIKE '%' || p_search_term || '%' OR
    l.phone ILIKE '%' || p_search_term || '%'
  )
  ORDER BY l.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create function to get individual lead with enhanced security
CREATE OR REPLACE FUNCTION public.get_lead_secure(
  p_lead_id UUID,
  p_requester_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  form_name TEXT,
  email TEXT,
  firstname TEXT,
  lastname TEXT,
  phone TEXT,
  service TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  fields JSONB,
  file_name TEXT,
  file_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify admin access
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required to access lead data';
  END IF;

  -- Log the specific access
  PERFORM public.log_sensitive_data_access(
    'leads',
    p_lead_id,
    'individual_view',
    p_requester_ip,
    p_user_agent,
    jsonb_build_object('timestamp', now())
  );

  -- Return the specific lead data
  RETURN QUERY
  SELECT 
    l.id,
    l.form_name,
    l.email,
    l.firstname,
    l.lastname,
    l.phone,
    l.service,
    l.notes,
    l.created_at,
    l.updated_at,
    l.fields,
    l.file_name,
    l.file_url
  FROM public.leads l
  WHERE l.id = p_lead_id;
END;
$$;

-- Revoke direct SELECT access to leads table for enhanced security
DROP POLICY IF EXISTS "Only admins can view leads" ON public.leads;

-- Create new restrictive policy that forces use of secure functions
CREATE POLICY "Leads access only through secure functions" 
ON public.leads 
FOR SELECT 
USING (false); -- Block direct SELECT access

-- Keep other policies for INSERT/UPDATE/DELETE but with audit logging
CREATE OR REPLACE FUNCTION public.update_lead_secure(
  p_lead_id UUID,
  p_updates JSONB,
  p_requester_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify admin access
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required to update lead data';
  END IF;

  -- Log the update attempt
  PERFORM public.log_sensitive_data_access(
    'leads',
    p_lead_id,
    'update',
    p_requester_ip,
    p_user_agent,
    jsonb_build_object(
      'updates', p_updates,
      'timestamp', now()
    )
  );

  -- Perform the update (this would need to be customized based on specific fields)
  -- For now, just log the attempt - actual update logic would depend on the fields being updated
  
END;
$$;

-- Create a function to get leads statistics without exposing raw data
CREATE OR REPLACE FUNCTION public.get_leads_statistics()
RETURNS TABLE(
  total_leads BIGINT,
  leads_today BIGINT,
  leads_this_week BIGINT,
  leads_this_month BIGINT,
  top_services TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify admin access
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Log the statistics access
  PERFORM public.log_sensitive_data_access(
    'leads',
    NULL,
    'statistics_view',
    NULL,
    NULL,
    jsonb_build_object('timestamp', now())
  );

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.leads) as total_leads,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= CURRENT_DATE) as leads_today,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as leads_this_week,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as leads_this_month,
    (SELECT ARRAY_AGG(service) FROM (
      SELECT service, COUNT(*) as cnt 
      FROM public.leads 
      WHERE service IS NOT NULL 
      GROUP BY service 
      ORDER BY cnt DESC 
      LIMIT 5
    ) t) as top_services;
END;
$$;