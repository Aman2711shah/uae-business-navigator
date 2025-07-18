import { useState } from 'react';
import { 
  sanitizeInput, 
  sanitizeHtml, 
  validateContent, 
  checkRateLimit, 
  rateLimitKey,
  clearRateLimit
} from '@/lib/security';
import { useToast } from '@/hooks/use-toast';
import { logSuspiciousUpload } from '@/lib/security-logger';

export const useSecureContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateAndSanitizePost = async (
    title: string, 
    content: string, 
    userId: string,
    tags?: string[]
  ) => {
    setIsLoading(true);
    
    try {
      // Rate limiting for post creation
      const rateLimitKeyValue = rateLimitKey('create_post', userId);
      if (!checkRateLimit(rateLimitKeyValue, 5, 60 * 60 * 1000)) { // 5 posts per hour
        throw new Error('Too many posts created. Please wait before creating another post.');
      }

      // Sanitize inputs
      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeHtml(content);
      const cleanTags = tags?.map(tag => sanitizeInput(tag)).filter(Boolean) || [];

      // Validate title
      if (!cleanTitle || cleanTitle.length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      if (cleanTitle.length > 200) {
        throw new Error('Title cannot exceed 200 characters');
      }

      // Validate content
      const contentValidation = validateContent(cleanContent);
      if (!contentValidation.isValid) {
        throw new Error(contentValidation.errors.join('. '));
      }

      // Validate tags
      if (cleanTags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }

      if (cleanTags.some(tag => tag.length > 50)) {
        throw new Error('Tags cannot exceed 50 characters');
      }

      // Check for spam patterns
      const suspiciousPatterns = [
        /(.)\1{10,}/g, // Repeated characters
        /https?:\/\/[^\s]+/gi, // URLs (could be spam)
        /\b(free|money|click|buy|now|urgent|limited|offer)\b/gi // Spam keywords
      ];

      const combinedText = `${cleanTitle} ${cleanContent}`;
      const suspiciousMatches = suspiciousPatterns.reduce((count, pattern) => {
        return count + (combinedText.match(pattern) || []).length;
      }, 0);

      if (suspiciousMatches > 3) {
        throw new Error('Content appears to be spam. Please review and try again.');
      }

      return {
        title: cleanTitle,
        content: cleanContent,
        tags: cleanTags,
        isValid: true
      };

    } catch (error: any) {
      console.error('Content validation error:', error);
      toast({
        variant: "destructive",
        title: "Content validation failed",
        description: error.message || "Please check your input and try again",
      });
      return {
        title: '',
        content: '',
        tags: [],
        isValid: false,
        error: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndSanitizeComment = async (
    comment: string, 
    userId: string
  ) => {
    setIsLoading(true);
    
    try {
      // Rate limiting for comments
      const rateLimitKeyValue = rateLimitKey('create_comment', userId);
      if (!checkRateLimit(rateLimitKeyValue, 10, 60 * 60 * 1000)) { // 10 comments per hour
        throw new Error('Too many comments created. Please wait before commenting again.');
      }

      // Sanitize comment
      const cleanComment = sanitizeHtml(comment);

      // Validate comment
      if (!cleanComment || cleanComment.length < 1) {
        throw new Error('Comment cannot be empty');
      }

      if (cleanComment.length > 1000) {
        throw new Error('Comment cannot exceed 1000 characters');
      }

      // Check for spam
      const spamPatterns = [
        /(.)\1{5,}/g, // Repeated characters
        /https?:\/\/[^\s]+/gi, // URLs
        /\b(spam|bot|fake|scam)\b/gi // Obvious spam
      ];

      const spamMatches = spamPatterns.reduce((count, pattern) => {
        return count + (cleanComment.match(pattern) || []).length;
      }, 0);

      if (spamMatches > 2) {
        throw new Error('Comment appears to be spam. Please review and try again.');
      }

      return {
        comment: cleanComment,
        isValid: true
      };

    } catch (error: any) {
      console.error('Comment validation error:', error);
      toast({
        variant: "destructive",
        title: "Comment validation failed",
        description: error.message || "Please check your comment and try again",
      });
      return {
        comment: '',
        isValid: false,
        error: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  const validateFileUpload = (file: File) => {
    const errors: string[] = [];
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size cannot exceed 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    // Check filename
    if (file.name.length > 255) {
      errors.push('Filename is too long');
    }

    // Check for suspicious filenames
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.vbs$/i,
      /\.js$/i,
      /\.php$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('File type not allowed');
    }

    // Log suspicious upload attempts (fire and forget)
    if (errors.length > 0) {
      logSuspiciousUpload('unknown', file.name, errors.join(', ')).catch(console.error);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    validateAndSanitizePost,
    validateAndSanitizeComment,
    validateFileUpload,
    isLoading
  };
};