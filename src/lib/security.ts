// Security utilities for the application

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://ajxbjxoujummahqcctuo.supabase.co wss://ajxbjxoujummahqcctuo.supabase.co https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  let score = 0;
  
  // Enhanced password requirements (consistent with validation.ts)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else {
    score += 2;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }
  
  if (/^[a-zA-Z]+$/.test(password)) {
    errors.push('Password cannot contain only letters');
  }
  
  if (/^\d+$/.test(password)) {
    errors.push('Password cannot contain only numbers');
  }
  
  // Check against common passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains common words or patterns');
  }
  
  const strength = score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak';
  
  return {
    isValid: errors.length === 0 && strength !== 'weak',
    errors,
    strength
  };
};

export const rateLimitKey = (action: string, userId?: string): string => {
  const identifier = userId || 'anonymous';
  return `${action}:${identifier}`;
};

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};

export const clearRateLimit = (key: string): void => {
  rateLimitStore.delete(key);
};

// Enhanced input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 1000); // Limit length
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // Remove dangerous tags and attributes
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim()
    .substring(0, 5000);
};

export const sanitizeFileName = (filename: string): string => {
  if (!filename || typeof filename !== 'string') return 'untitled';
  
  return filename
    .replace(/[^a-zA-Z0-9.-_]/g, '_') // Replace invalid chars
    .replace(/_{2,}/g, '_') // Replace multiple underscores
    .replace(/^[._]/, '') // Remove leading dots/underscores
    .substring(0, 255); // Limit length
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

// Content validation
export const validateContent = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'string') {
    errors.push('Content is required');
    return { isValid: false, errors };
  }
  
  if (content.length > 10000) {
    errors.push('Content is too long (maximum 10,000 characters)');
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(content))) {
    errors.push('Content contains potentially dangerous elements');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};