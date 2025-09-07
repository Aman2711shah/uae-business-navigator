-- Check if freezone_public_info is a view and what it's based on
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE viewname = 'freezone_public_info';