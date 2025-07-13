import PostCard from './PostCard';
import { Post } from './types';

interface PostsFeedProps {
  posts: Post[];
  currentUserId?: string;
}

export default function PostsFeed({ posts, currentUserId }: PostsFeedProps) {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}