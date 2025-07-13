import { ArrowLeft, Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IndustryFeedHeaderProps {
  industry: string;
  onBack: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'recent' | 'popular' | 'trending';
  onSortChange: (value: 'recent' | 'popular' | 'trending') => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  availableTags: string[];
  onRefresh: () => void;
  isLoading: boolean;
  onCreatePost: () => void;
}

export default function IndustryFeedHeader({
  industry,
  onBack,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedTag,
  onTagChange,
  availableTags,
  onRefresh,
  isLoading,
  onCreatePost
}: IndustryFeedHeaderProps) {
  return (
    <div className="bg-card border-b border-border/50 p-4 sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{industry}</h1>
          <p className="text-muted-foreground text-sm">Community Discussions</p>
        </div>
        <Button variant="cta" size="sm" onClick={onCreatePost}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-input/50 border-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Select value={sortBy} onValueChange={onSortChange}>
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
            <Select value={selectedTag} onValueChange={onTagChange}>
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

          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {selectedTag && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onTagChange('')}>
              #{selectedTag} ×
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}