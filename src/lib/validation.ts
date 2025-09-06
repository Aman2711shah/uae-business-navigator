import { z } from 'zod';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

// Enhanced email validation using zod
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must be less than 254 characters')
  .refine((email) => {
    // Additional validation for email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }, 'Please enter a valid email address');

// Enhanced password validation using zod
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  .refine((password) => {
    // Check for repeated characters
    return !/((.)\2{2,})/.test(password);
  }, 'Password cannot contain repeated characters')
  .refine((password) => {
    // Check against common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin'];
    return !commonPasswords.some(common => password.toLowerCase().includes(common));
  }, 'Password contains common words or patterns');

// Phone number validation using libphonenumber-js
export const phoneSchema = z.string()
  .optional()
  .refine((phone) => {
    if (!phone || phone.trim() === '') return true; // Optional field
    try {
      return isValidPhoneNumber(phone);
    } catch {
      return false;
    }
  }, 'Please enter a valid phone number');

// Validate and format email
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid email' };
    }
    return { isValid: false, error: 'Invalid email' };
  }
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[]; strength: 'weak' | 'medium' | 'strong' } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [], strength: 'strong' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => err.message);
      const strength = password.length >= 8 ? 'medium' : 'weak';
      return { isValid: false, errors, strength };
    }
    return { isValid: false, errors: ['Invalid password'], strength: 'weak' };
  }
};

// Validate and normalize phone number
export const normalizePhone = (phone: string): { isValid: boolean; formatted?: string; error?: string } => {
  if (!phone || phone.trim() === '') {
    return { isValid: true, formatted: '' }; // Optional field
  }

  try {
    const phoneNumber = parsePhoneNumber(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      return { 
        isValid: true, 
        formatted: phoneNumber.formatInternational() 
      };
    } else {
      return { isValid: false, error: 'Invalid phone number format' };
    }
  } catch (error) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
};

// File validation schema
export const fileSchema = z.object({
  name: z.string().min(1, 'Filename is required'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().refine((type) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(type);
  }, 'File type must be PDF, JPG, PNG, DOC, or DOCX')
});

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  email: emailSchema,
  phone: phoneSchema,
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

// File upload validation
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  try {
    fileSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    });
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid file' };
    }
    return { isValid: false, error: 'Invalid file' };
  }
};