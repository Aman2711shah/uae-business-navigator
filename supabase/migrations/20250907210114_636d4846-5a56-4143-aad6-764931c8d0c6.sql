-- Investigate the freezone_public_info view definition to understand its security implications
-- and check if we need to modify the underlying table security or drop the view

-- First, let's check if this view has any data and understand its structure
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE viewname = 'freezone_public_info';

-- Also check if there are any policies on the underlying freezone_info table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('freezone_info', 'freezone_public_info');