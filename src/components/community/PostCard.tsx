import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Flag, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CommentSection from './CommentSection';

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
  const { toast } = useToast();

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

  return (
    <Card className="glow-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground truncate">{authorName}</span>
              <Badge variant="secondary" className="text-xs shrink-0">
                {post.industry_tag}
              </Badge>
            </div>
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
        <div className="flex items-center gap-1 pt-3 border-t border-border/50">
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