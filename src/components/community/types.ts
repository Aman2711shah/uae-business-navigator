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
  image_url?: string;
  profiles?: {
    full_name: string;
  } | null;
  community_users?: {
    username: string;
    company_name: string;
    business_stage: string;
  } | null;
}