import { z } from 'zod';

export const authSchema = {
  signIn: z.object({
    email: z.string()
      .email('Please enter a valid email address')
      .max(254, 'Email address is too long')
      .refine(email => !email.includes('<') && !email.includes('>'), 'Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
  }),
  
  signUp: z.object({
    fullName: z.string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long')
      .refine(name => !/[<>]/.test(name), 'Full name contains invalid characters'),
    email: z.string()
      .email('Please enter a valid email address')
      .max(254, 'Email address is too long')
      .refine(email => !email.includes('<') && !email.includes('>'), 'Invalid email format'),
    password: z.string()
      .min(12, 'Password must be at least 12 characters')
      .max(128, 'Password is too long')
      .refine(password => /[a-z]/.test(password), 'Password must contain at least one lowercase letter')
      .refine(password => /[A-Z]/.test(password), 'Password must contain at least one uppercase letter')
      .refine(password => /\d/.test(password), 'Password must contain at least one number')
      .refine(password => /[!@#$%^&*(),.?":{}|<>]/.test(password), 'Password must contain at least one special character'),
  }),
};

export const businessSetupSchema = z.object({
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(200, 'Business name is too long')
    .refine(name => !/[<>]/.test(name), 'Business name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long'),
  jurisdiction: z.string()
    .min(1, 'Please select a jurisdiction')
    .max(100, 'Jurisdiction name is too long'),
  businessType: z.string()
    .min(1, 'Please select a business type')
    .max(100, 'Business type is too long'),
  activities: z.string()
    .min(10, 'Please describe your business activities (minimum 10 characters)')
    .max(2000, 'Business activities description is too long')
    .refine(activities => !/[<>]/.test(activities), 'Business activities contain invalid characters'),
});

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .refine(name => !/[<>]/.test(name), 'Name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long')
    .refine(message => !/[<>]/.test(message), 'Message contains invalid characters'),
});

// Community content validation schemas
export const communityPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .refine(title => !/[<>]/.test(title), 'Title contains invalid characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10,000 characters'),
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters')).max(10, 'Cannot have more than 10 tags').optional(),
  industryTag: z.string().min(1, 'Industry tag is required').max(50, 'Industry tag is too long'),
});

export const communityCommentSchema = z.object({
  comment: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters'),
});

// Enhanced sanitization functions (using centralized security functions)
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., -
    .substring(0, 254); // Email length limit
};

export const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone
    .replace(/[^\d+()-\s]/g, '') // Only allow digits, +, (), -, space
    .trim()
    .substring(0, 20); // Reasonable phone length limit
};