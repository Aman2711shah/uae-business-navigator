import { supabase } from "@/integrations/supabase/client";

export interface AvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadAvatar = async (file: File, userId: string): Promise<AvatarUploadResult> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true // Replace existing file
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return { success: false, error: error.message || 'Failed to upload avatar' };
  }
};

export const deleteAvatar = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Avatar delete error:', error);
    return false;
  }
};