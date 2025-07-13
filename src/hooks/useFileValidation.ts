import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useFileValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateFile = (file: File): ValidationResult => {
    setIsValidating(true);
    
    try {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return {
          isValid: false,
          error: "Upload failed. File size exceeds 5MB limit. Please choose a smaller file."
        };
      }

      // Check file type (.pdf, .jpg, .jpeg, .png only)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png'
      ];
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
        return {
          isValid: false,
          error: "Upload failed. Please check your file type. Only PDF, JPG, and PNG files are allowed."
        };
      }

      // Additional validation for corrupted files
      if (file.size === 0) {
        return {
          isValid: false,
          error: "Upload failed. The selected file appears to be corrupted or empty."
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: "Upload failed. An unexpected error occurred during file validation."
      };
    } finally {
      setIsValidating(false);
    }
  };

  const validateMultipleFiles = (files: FileList | File[]): ValidationResult => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const result = validateFile(file);
      if (!result.isValid) {
        return result;
      }
    }
    
    return { isValid: true };
  };

  return {
    validateFile,
    validateMultipleFiles,
    isValidating
  };
};