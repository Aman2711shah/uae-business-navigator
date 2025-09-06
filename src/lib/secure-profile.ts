import { supabase } from "@/integrations/supabase/client";

// Type for public profile data (safe to expose)
export interface PublicProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  headline: string | null;
  bio: string | null;
  services: string[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Type for private profile data (includes sensitive info)
export interface PrivateProfile extends PublicProfile {
  email: string | null;
  full_name: string | null;
}

/**
 * Get public profile data (safe for display to other users)
 * Only exposes non-sensitive information
 */
export const getPublicProfile = async (userId: string): Promise<{ data: PublicProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        display_name,
        headline,
        bio,
        services,
        avatar_url,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    return { data, error };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return { data: null, error };
  }
};

/**
 * Get current user's private profile (includes email and full name)
 * Only works for the authenticated user's own profile
 */
export const getCurrentUserProfile = async (): Promise<{ data: PrivateProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase.rpc('get_current_user_profile');
    
    if (error) {
      throw error;
    }
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error fetching private profile:', error);
    return { data: null, error };
  }
};

/**
 * Update user profile (only for own profile)
 */
export const updateUserProfile = async (updates: Partial<PrivateProfile>): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

/**
 * Get multiple public profiles (for community features)
 */
export const getPublicProfiles = async (userIds: string[]): Promise<{ data: PublicProfile[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        display_name,
        headline,
        bio,
        services,
        avatar_url,
        created_at,
        updated_at
      `)
      .in('user_id', userIds);

    return { data: data || [], error };
  } catch (error) {
    console.error('Error fetching public profiles:', error);
    return { data: [], error };
  }
};