import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Settings, Share, Flag, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PostCreationBox from "@/components/community/PostCreationBox";
import PostCard from "@/components/community/PostCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import { Post } from "@/components/community/types";

interface Community {
  id: string;
  name: string;
  industry_tag: string;
  description: string;
  member_count: number;
  cover_url?: string;
  slug: string;
  created_by: string;
}

const CommunityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetchCommunity();
      fetchPosts();
    }
  }, [slug]);

  useEffect(() => {
    if (user && community) {
      checkMembership();
      fetchUserProfile();
    }
  }, [user, community]);

  const fetchCommunity = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setCommunity(data);
    } catch (error) {
      console.error('Error fetching community:', error);
      toast({
        title: "Error",
        description: "Community not found",
        variant: "destructive"
      });
      navigate('/communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          likes_count,
          comments_count,
          created_at,
          profile_id,
          community_id,
          is_marketplace,
          metadata,
          pinned,
          updated_at,
          profiles:profile_id (
            display_name,
            full_name,
            avatar_url
          )
        `)
        .eq('community_id', community?.id)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const checkMembership = async () => {
    if (!user || !community) return;

    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', community.id)
        .eq('profile_id', user.id)
        .single();

      setIsMember(!!data);
    } catch (error) {
      setIsMember(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!user || !community) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          profile_id: user.id
        });

      if (error) throw error;

      setIsMember(true);
      setCommunity(prev => prev ? { ...prev, member_count: prev.member_count + 1 } : null);
      
      toast({
        title: "Success",
        description: "You've joined the community!"
      });
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive"
      });
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !community) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', community.id)
        .eq('profile_id', user.id);

      if (error) throw error;

      setIsMember(false);
      setCommunity(prev => prev ? { ...prev, member_count: prev.member_count - 1 } : null);

      toast({
        title: "Success",
        description: "You've left the community"
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: "Error",
        description: "Failed to leave community",
        variant: "destructive"
      });
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Community not found</h2>
          <Button onClick={() => navigate('/communities')}>
            Back to Communities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50">
        {/* Cover Image */}
        {community.cover_url && (
          <div className="w-full h-48 bg-muted overflow-hidden">
            <img 
              src={community.cover_url} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Community Info */}
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/communities')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground flex-1">
              {community.name}
            </h1>
            {user?.id === community.created_by && (
              <Crown className="h-5 w-5 text-yellow-500 ml-2" />
            )}
          </div>

          {community.description && (
            <p className="text-muted-foreground mb-4">{community.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {community.member_count} members
              </div>
              <span>•</span>
              <span>{community.industry_tag}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
              {user?.id === community.created_by && (
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant={isMember ? "outline" : "default"}
                onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
              >
                {isMember ? "Leave" : "Join"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {/* Create Post */}
        {isMember && (
          <div className="p-4">
            <PostCreationBox 
              onCreatePost={() => setShowCreatePost(true)}
              userProfile={userProfile}
            />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No posts yet
              </h3>
              <p className="text-muted-foreground">
                {isMember ? "Be the first to start a conversation!" : "Join the community to see posts"}
              </p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onPostUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        community={community}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default CommunityDetail;