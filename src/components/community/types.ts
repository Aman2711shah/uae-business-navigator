export interface Post {
  id: string;
  title?: string;
  content?: string;
  body?: string;
  industry_tag?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id?: string;
  profile_id: string;
  community_id?: string;
  is_marketplace?: boolean;
  metadata?: any;
  pinned?: boolean;
  updated_at?: string;
  image_url?: string;
  profiles?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  community_users?: {
    username: string;
    company_name: string;
    business_stage: string;
  } | null;
}