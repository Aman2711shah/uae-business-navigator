import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "./UserAvatar";
import CommentSection from "./CommentSection";
import { Post } from "./types";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onPostUpdate?: (post: Post) => void;
}

export default function PostCard({ post, currentUserId, onPostUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserId) {
      checkLikeStatus();
    }
    extractLinkPreview();
  }, [currentUserId, post.id]);

  const checkLikeStatus = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', currentUserId)
        .single();

      setIsLiked(!!data);

      setIsLiked(!!data);
    } catch (error) {
      setIsLiked(false);
    }
  };

  const extractLinkPreview = () => {
    const content = post.content || post.body || "";
    if (!content) return;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    if (urls && urls.length > 0) {
      setLinkPreview(urls[0]);
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
            user_id: currentUserId
          });

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }

      // Update the post object for parent component
      if (onPostUpdate) {
        onPostUpdate({
          ...post,
          likes_count: isLiked ? likesCount - 1 : likesCount + 1
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    // Placeholder for bookmark functionality
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Post removed from your bookmarks" : "Post saved to your bookmarks"
    });
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || "Community Post",
          text: (post.content || post.body || "").substring(0, 100) + "...",
          url: postUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard"
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  // Get display info
  const authorName = post.profiles?.display_name || post.profiles?.full_name || "Anonymous";
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const isMarketplace = post.is_marketplace && post.metadata?.price;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-4">
          <UserAvatar 
            name={authorName}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-foreground truncate">
                {authorName}
              </h4>
              {isMarketplace && (
                <Badge variant="secondary" className="text-xs">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Marketplace
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {timeAgo}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Report post
              </DropdownMenuItem>
              {currentUserId === post.user_id && (
                <>
                  <DropdownMenuItem>
                    Edit post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="space-y-3">
          {post.title && (
            <h3 className="font-semibold text-lg text-foreground">
              {post.title}
            </h3>
          )}
          
          {(post.content || post.body) && (
            <p className="text-foreground whitespace-pre-wrap">
              {post.content || post.body}
            </p>
          )}

          {/* Marketplace Info */}
          {isMarketplace && post.metadata?.price && (
            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    ${post.metadata.price}
                  </p>
                  {post.metadata.currency && post.metadata.currency !== 'USD' && (
                    <p className="text-sm text-muted-foreground">
                      {post.metadata.currency}
                    </p>
                  )}
                </div>
                <Button size="sm">
                  Contact Seller
                </Button>
              </div>
            </div>
          )}

          {/* Link Preview */}
          {linkPreview && (
            <div className="border rounded-lg p-3 bg-muted/30">
              <a 
                href={linkPreview} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {linkPreview}
              </a>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likesCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments_count || 0}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? "text-primary" : ""}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
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