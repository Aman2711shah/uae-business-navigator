-- Fix the security warning for generate_request_id function
CREATE OR REPLACE FUNCTION generate_request_id()
RETURNS text AS $$
DECLARE
  date_part text;
  random_part text;
  request_id text;
  id_exists boolean;
BEGIN
  -- Generate date part (YYYYMMDD format)
  date_part := to_char(now(), 'YYYYMMDD');
  
  -- Try to generate a unique ID
  LOOP
    -- Generate 4-digit random number
    random_part := lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Combine parts
    request_id := 'WZT-' || date_part || '-' || random_part;
    
    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM onboarding_submissions WHERE request_id = request_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN request_id;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;