import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';

interface Post {
  id: string;
  title: string;
  body: string;
  industry_tag: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface IndustryFeedProps {
  industry: string;
  onBack: () => void;
  currentUserId?: string;
}

export default function IndustryFeed({ industry, onBack, currentUserId }: IndustryFeedProps) {
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
      
      setPosts(data || []);
      
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
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-primary pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{industry}</h1>
            <p className="text-muted-foreground text-sm">Community Discussions</p>
          </div>
          <Button variant="cta" size="sm" onClick={() => setShowCreatePost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts, topics, or tags..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input/50 border-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={sortBy} onValueChange={(value: 'recent' | 'popular' | 'trending') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>

            {availableTags.length > 0 && (
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tags</SelectItem>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>#{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="ghost" size="sm" onClick={fetchPosts} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedTag('')}>
                #{selectedTag} ×
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || selectedTag ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filters' 
                : `Be the first to start a discussion in ${industry}!`
              }
            </p>
            {!searchTerm && !selectedTag && (
              <Button variant="cta" onClick={() => setShowCreatePost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        industry={industry}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}