import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, Edit, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/community/UserAvatar";
import PostCard from "@/components/community/PostCard";

interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  email?: string;
  headline?: string;
  bio?: string;
  services?: string[];
  avatar_url?: string;
  created_at: string;
}

interface MarketplaceItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  post_id?: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = user?.id === profile?.user_id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserPosts();
      fetchMarketplaceItems();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Profile not found",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:profile_id (
            display_name,
            full_name,
            avatar_url
          ),
          communities:community_id (
            name,
            slug
          )
        `)
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchMarketplaceItems = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMarketplaceItems(data || []);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({ status: 'sold' })
        .eq('id', itemId);

      if (error) throw error;

      setMarketplaceItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status: 'sold' } : item
        )
      );

      toast({
        title: "Success",
        description: "Item marked as sold"
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      });
    }
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const displayName = profile.display_name || profile.full_name || "Anonymous User";
  const joinDate = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Profile Info */}
          <div className="flex items-start space-x-4">
            <UserAvatar 
              name={displayName}
              size="lg"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {displayName}
                </h1>
                {isOwnProfile ? (
                  <Button size="sm" onClick={() => navigate('/profile/edit')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      Hire
                    </Button>
                  </div>
                )}
              </div>

              {profile.headline && (
                <p className="text-muted-foreground mb-2">{profile.headline}</p>
              )}

              {profile.bio && (
                <p className="text-sm text-foreground mb-3">{profile.bio}</p>
              )}

              {profile.services && profile.services.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-2xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="services">Services & Listings</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 mt-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No posts yet
                </h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "Share your first post with the community" : "This user hasn't posted anything yet"}
                </p>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4 mt-6">
            {marketplaceItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No listings yet
                </h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "Create your first marketplace listing" : "This user hasn't listed any services yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {marketplaceItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <Badge 
                              variant={item.status === 'available' ? 'default' : 'secondary'}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-lg text-foreground">
                              ${item.price} {item.currency}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {isOwnProfile && item.status === 'available' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkAsSold(item.id)}
                            >
                              Mark as Sold
                            </Button>
                          )}
                          {!isOwnProfile && item.status === 'available' && (
                            <Button size="sm">
                              Contact Seller
                            </Button>
                          )}
                          {item.post_id && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigate(`/post/${item.post_id}`)}
                            >
                              View Post
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">About</h3>
                    <p className="text-foreground">
                      {profile.bio || "No bio provided"}
                    </p>
                  </div>

                  {profile.services && profile.services.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.services.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Member Since</h3>
                    <p className="text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;