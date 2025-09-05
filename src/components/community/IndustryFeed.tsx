import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import IndustryFeedHeader from './IndustryFeedHeader';
import PostCreationBox from './PostCreationBox';
import PostsFeed from './PostsFeed';
import FeedEmptyState from './FeedEmptyState';
import FeedLoadingState from './FeedLoadingState';
import CreatePostModal from './CreatePostModal';
import { Post } from './types';

interface IndustryFeedProps {
  industry: string;
  onBack: () => void;
  currentUserId?: string;
  userProfile?: any;
}

export default function IndustryFeed({ industry, onBack, currentUserId, userProfile }: IndustryFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [industry, sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('industry_tag', industry);

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'trending':
          query = query.order('comments_count', { ascending: false });
          break;
        default: // recent
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      
      // Fetch user profiles for each post
      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {
          const [profileData, communityUserData] = await Promise.all([
            supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', post.user_id)
              .maybeSingle(),
            supabase
              .from('community_users')
              .select('username, company_name, business_stage')
              .eq('user_id', post.user_id)
              .maybeSingle()
          ]);
          
          return {
            ...post,
            profile_id: post.user_id, // Map user_id to profile_id for Post interface compatibility
            content: post.body, // Map body to content for Post interface compatibility
            profiles: profileData.data,
            community_users: communityUserData.data
          };
        })
      );
      
      setPosts(postsWithProfiles);
      
      // Extract unique tags
      const tags = new Set<string>();
      data?.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags).sort());

    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Failed to load posts",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.body && post.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const hasFilters = Boolean(searchTerm || selectedTag);

  return (
    <div className="min-h-screen bg-background pb-20">
      <IndustryFeedHeader
        industry={industry}
        onBack={onBack}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        availableTags={availableTags}
        onRefresh={fetchPosts}
        isLoading={isLoading}
        onCreatePost={() => setShowCreatePost(true)}
      />

      {/* Post Creation Box */}
      <div className="p-4 pt-0">
        <PostCreationBox 
          onCreatePost={() => setShowCreatePost(true)}
          userProfile={userProfile}
        />
      </div>

      {isLoading ? (
        <FeedLoadingState />
      ) : filteredPosts.length === 0 ? (
        <FeedEmptyState 
          industry={industry}
          hasFilters={hasFilters}
          onCreatePost={() => setShowCreatePost(true)}
        />
      ) : (
        <PostsFeed 
          posts={filteredPosts}
          currentUserId={currentUserId}
        />
      )}

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        industry={industry}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}