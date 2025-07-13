export interface Post {
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