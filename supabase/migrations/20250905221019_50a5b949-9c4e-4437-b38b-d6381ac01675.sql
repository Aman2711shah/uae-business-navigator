-- Enable RLS on remaining tables and add missing columns
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS member_count integer DEFAULT 0;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS cover_url text;

-- Add missing columns to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0;

-- Add missing columns to profiles table  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS services text[];

-- Create RLS policies for communities
CREATE POLICY "Communities are publicly readable" ON public.communities
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create communities" ON public.communities
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Community creators can update their communities" ON public.communities
FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for community_members
CREATE POLICY "Members can view community memberships" ON public.community_members
FOR SELECT USING (true);

CREATE POLICY "Users can join communities" ON public.community_members
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can leave communities" ON public.community_members
FOR DELETE USING (auth.uid() = profile_id);

-- Create RLS policies for posts
CREATE POLICY "Posts are publicly readable" ON public.posts
FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON public.posts
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own posts" ON public.posts
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
FOR DELETE USING (auth.uid() = profile_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are publicly readable" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
FOR DELETE USING (auth.uid() = profile_id);

-- Create RLS policies for marketplace_items
CREATE POLICY "Marketplace items are publicly readable" ON public.marketplace_items
FOR SELECT USING (true);

CREATE POLICY "Users can create marketplace items" ON public.marketplace_items
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own marketplace items" ON public.marketplace_items
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own marketplace items" ON public.marketplace_items
FOR DELETE USING (auth.uid() = profile_id);

-- Create RLS policies for marketplace_images
CREATE POLICY "Marketplace images are publicly readable" ON public.marketplace_images
FOR SELECT USING (true);

CREATE POLICY "Users can upload marketplace images for their items" ON public.marketplace_images
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.marketplace_items 
    WHERE id = marketplace_images.item_id 
    AND profile_id = auth.uid()
  )
);

-- Create RLS policies for post_attachments
CREATE POLICY "Post attachments are publicly readable" ON public.post_attachments
FOR SELECT USING (true);

CREATE POLICY "Users can upload attachments for their posts" ON public.post_attachments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE id = post_attachments.post_id 
    AND profile_id = auth.uid()
  )
);

-- Create RLS policies for flags
CREATE POLICY "Users can create flags" ON public.flags
FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can view all flags" ON public.flags
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Create triggers to update counts
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = member_count - 1
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Create function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.posts
      SET comments_count = comments_count + 1
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.posts
      SET comments_count = comments_count - 1
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(profile_id, post_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can like posts" ON public.likes
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can unlike posts" ON public.likes
FOR DELETE USING (auth.uid() = profile_id);

CREATE POLICY "Likes are publicly readable" ON public.likes
FOR SELECT USING (true);

-- Create trigger to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();