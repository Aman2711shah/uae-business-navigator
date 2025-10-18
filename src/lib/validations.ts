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

// Service Application Form Schema
export const serviceApplicationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  
  company: z.string()
    .max(200, 'Company name must be less than 200 characters')
    .optional(),
  
  businessActivity: z.string()
    .min(1, 'Business activity is required')
    .max(500, 'Business activity must be less than 500 characters'),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

export type ServiceApplicationFormData = z.infer<typeof serviceApplicationSchema>;

// File Upload Schema
export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.union([
    z.literal('application/pdf'),
    z.literal('image/png'), 
    z.literal('image/jpeg')
  ])
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

// Document Upload Result Schema
export const uploadResultSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string().optional()
});

export type UploadResult = z.infer<typeof uploadResultSchema>;

// Validate file before upload
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      // Align error message with tests and server expectations
      error: `File type ${file.type} not allowed`
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      // Include explicit limit phrasing for test compatibility
      error: 'File size exceeds 10MB limit'
    };
  }

  return { isValid: true };
};

// Upload Documents Request Schema
export const uploadDocumentsRequestSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.string().email('Valid email is required'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone is required'),
    company: z.string().optional(),
    businessActivity: z.string().min(1, 'Business activity is required'),
    notes: z.string().optional()
  }),
  documents: z.array(uploadResultSchema).min(1, 'At least one document is required')
});

// Create Checkout Session Schema
export const createCheckoutSessionSchema = z.object({
  onboardingId: z.string().uuid('Invalid onboarding ID'),
  customerEmail: z.string().email('Valid email is required'),
  amount: z.number().positive('Amount must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional()
});

export const trackApplicationRequestSchema = z.object({
  requestId: z.string().regex(/^WZT-\d{8}-\d{4}$/, 'Invalid request ID format')
});

export const trackApplicationResponseSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'approved', 'rejected']),
  submittedAt: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  contactName: z.string(),
  timeline: z.array(z.object({
    step: z.string(),
    status: z.enum(['completed', 'current', 'pending']),
    date: z.string().datetime().optional(),
    description: z.string()
  }))
});

// Validation error formatter
export const formatValidationErrors = (error: z.ZodError): string => {
  return error.issues.map(err => err.message).join(', ');
};