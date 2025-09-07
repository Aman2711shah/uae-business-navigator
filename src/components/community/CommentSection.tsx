import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from './UserAvatar';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

export default function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUserId || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          comment: newComment.trim(),
        })
        .select('*')
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');
      
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map(comment => {
            const authorName = comment.profiles?.full_name || 'Anonymous User';
            const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase();
            const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

            return (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <UserAvatar 
                  name={authorName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground truncate">
                      {authorName}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {timeAgo}
                    </span>
                    {comment.user_id === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive">
                            Delete Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Comment */}
      {currentUserId ? (
        <div className="flex gap-3">
          <UserAvatar size="sm" />
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] resize-none text-sm"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to post
              </p>
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                variant="default"
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Please log in to comment
          </p>
        </div>
      )}
    </div>
  );
}
