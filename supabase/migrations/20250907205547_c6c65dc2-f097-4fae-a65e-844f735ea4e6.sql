-- Create a temporary function to add sample data only if the posts table is empty
DO $$
BEGIN
  -- Only add sample data if there are no posts yet
  IF NOT EXISTS (SELECT 1 FROM community_posts LIMIT 1) THEN
    -- We'll create placeholder posts that will be associated with real users when they sign up
    -- For now, we'll use the auth.users table to get any existing user or create sample posts without user_id
    
    RAISE NOTICE 'No community posts found. Sample data would be added when users create posts.';
    
  END IF;
END $$;