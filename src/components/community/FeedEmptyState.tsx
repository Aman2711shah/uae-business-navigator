import { TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedEmptyStateProps {
  industry: string;
  hasFilters: boolean;
  onCreatePost: () => void;
}

export default function FeedEmptyState({ industry, hasFilters, onCreatePost }: FeedEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        {hasFilters ? 'No posts found' : 'No posts yet'}
      </h3>
      <p className="text-muted-foreground mb-6">
        {hasFilters 
          ? 'Try adjusting your search or filters' 
          : `Be the first to start a discussion in ${industry}!`
        }
      </p>
      {!hasFilters && (
        <Button onClick={onCreatePost}>
          <Plus className="h-4 w-4 mr-2" />
          Create First Post
        </Button>
      )}
    </div>
  );
}