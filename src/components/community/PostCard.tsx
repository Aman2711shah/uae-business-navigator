import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Flag, MoreHorizontal, Bookmark, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CommentSection from './CommentSection';
import UserAvatar from './UserAvatar';

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
  image_url?: string;
  profiles?: {
    full_name: string;
  };
  community_users?: {
    username: string;
    company_name: string;
    business_stage: string;
  };
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onPostUpdate?: (updatedPost: Post) => void;
}

export default function PostCard({ post, currentUserId, onPostUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserId) {
      checkLikeStatus();
    }
    extractLinkPreview();
  }, [currentUserId, post.id]);

  const checkLikeStatus = async () => {
    try {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', currentUserId!)
        .maybeSingle();
      
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const extractLinkPreview = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = post.body.match(urlRegex);
    if (urls && urls.length > 0) {
      // In a real app, you'd fetch the preview from the URL
      // For now, we'll just show the first URL found
      setLinkPreview({ url: urls[0] });
    }
  };

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);

        if (error) throw error;

        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: currentUserId,
          });

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Failed to update like",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId) return;
    
    // In a real app, you'd have a bookmarks table
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Post removed from your bookmarks." : "Post saved to your bookmarks.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.body.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Post link has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Failed to copy link",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const authorName = post.profiles?.full_name || 'Anonymous User';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const companyName = post.community_users?.company_name || 'Company';
  const businessStage = post.community_users?.business_stage || 'Startup';

  return (
    <Card className="glow-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <UserAvatar 
            name={authorName}
            username={post.community_users?.username}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground truncate">{authorName}</span>
              <Badge variant="secondary" className="text-xs shrink-0">
                {businessStage}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{companyName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Report Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-foreground mb-2 leading-tight">
            {post.title}
          </h3>
          <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>
          
          {/* Image */}
          {post.image_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-border/50">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
          
          {/* Link Preview */}
          {linkPreview && (
            <div className="mt-3 border border-border/50 rounded-lg p-3 bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{linkPreview.url}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLike}
              disabled={isLiking || !currentUserId}
              className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments_count}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBookmark}
            disabled={!currentUserId}
            className={`${isBookmarked ? 'text-blue-500 hover:text-blue-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <CommentSection 
              postId={post.id} 
              currentUserId={currentUserId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}