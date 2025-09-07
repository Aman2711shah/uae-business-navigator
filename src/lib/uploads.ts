import { supabase } from '@/integrations/supabase/client';
import { validateFile, type UploadResult } from './validations';

const DOCUMENTS_BUCKET = 'service-uploads';

/**
 * Sanitize filename by removing special characters and replacing spaces
 */
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();
};

/**
 * Upload multiple files to Supabase Storage with enhanced error handling
 * @param userId - The user ID to organize files by
 * @param files - Array of files to upload
 * @param onProgress - Callback for upload progress (fileIndex, progress)
 * @returns Promise<UploadResult[]> - Array of upload results
 */
export const uploadDocuments = async (
  userId: string,
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Client-side validation
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(`Invalid file ${file.name}: ${validation.error}`);
    }

    // Generate unique file path with sanitized name
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const filePath = `${userId}/${timestamp}_${sanitizedName}`;

    try {
      // Start progress
      onProgress?.(i, 0);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // Provide specific error messages based on error codes
        let errorMessage = `Upload failed for ${file.name}`;
        if (error.message.includes('413')) {
          errorMessage = `File ${file.name} is too large. Maximum size is 10MB.`;
        } else if (error.message.includes('403')) {
          errorMessage = `Upload forbidden for ${file.name}. Please check file permissions.`;
        } else if (error.message.includes('401')) {
          errorMessage = `Authentication failed. Please log in and try again.`;
        } else if (error.message.includes('Bucket policy')) {
          errorMessage = `Bucket policy forbids upload of ${file.name}. Please contact support.`;
        } else {
          errorMessage = `${errorMessage}: ${error.message}`;
        }
        throw new Error(errorMessage);
      }

      // Update progress to 50% after upload
      onProgress?.(i, 50);

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(DOCUMENTS_BUCKET)
        .getPublicUrl(filePath);

      // Complete progress
      onProgress?.(i, 100);

      results.push({
        name: file.name,
        path: data.path,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl
      });

    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      onProgress?.(i, 0); // Reset progress on error
      throw error;
    }
  }

  return results;
};

/**
 * Delete a file from Supabase Storage
 * @param filePath - The storage path of the file to delete
 * @returns Promise<boolean> - Success status
 */
export const deleteDocument = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get download URL for a file
 * @param filePath - The storage path of the file
 * @returns Promise<string | null> - Download URL or null if failed
 */
export const getDocumentUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data } = supabase.storage
      .from(DOCUMENTS_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

/**
 * List files for a user
 * @param userId - The user ID to list files for
 * @returns Promise<any[]> - Array of file metadata
 */
export const listUserDocuments = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .list(userId);

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

/**
 * Get file size in human readable format
 * @param bytes - Size in bytes
 * @returns string - Formatted size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file type is allowed
 * @param fileType - MIME type of the file
 * @returns boolean - Whether file type is allowed
 */
export const isAllowedFileType = (fileType: string): boolean => {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  return allowedTypes.includes(fileType);
};

/**
 * Check if file size is within limits
 * @param fileSize - Size in bytes
 * @returns boolean - Whether file size is acceptable
 */
export const isValidFileSize = (fileSize: number): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return fileSize <= maxSize;
};