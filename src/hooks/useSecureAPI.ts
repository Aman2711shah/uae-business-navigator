// Secure API wrapper with rate limiting and validation

import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { sanitizeInput } from '@/lib/security';
import { logSecurityEvent } from '@/lib/security-logger';

interface SecureAPIOptions {
  requireAuth?: boolean;
  rateLimit?: string;
  validateInput?: boolean;
  maxRetries?: number;
}

export function useSecureAPI() {
  const makeSecureRequest = async (
    url: string,
    options: RequestInit & SecureAPIOptions = {}
  ) => {
    const {
      requireAuth = false,
      rateLimit,
      validateInput = true,
      maxRetries = 3,
      ...fetchOptions
    } = options;

    // Rate limiting
    if (rateLimit) {
      const clientIP = getClientIP();
      const rateLimitCheck = rateLimiter.check(rateLimit, clientIP);
      
      if (!rateLimitCheck.allowed) {
        await logSecurityEvent({
          event_type: 'rate_limit_exceeded',
          ip_address: clientIP,
          details: {
            action: rateLimit,
            url,
            timestamp: Date.now()
          },
          severity: 'medium'
        });
        
        throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)} seconds.`);
      }
    }

    // Input validation and sanitization
    if (validateInput && fetchOptions.body) {
      let body = fetchOptions.body;
      
      if (typeof body === 'string') {
        try {
          const parsed = JSON.parse(body);
          const sanitized = sanitizeObject(parsed);
          body = JSON.stringify(sanitized);
        } catch (e) {
          // If not JSON, sanitize as string
          body = sanitizeInput(body);
        }
      }
      
      fetchOptions.body = body;
    }

    // Add security headers
    const secureHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...fetchOptions.headers,
    };

    // Add CSRF token if available
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      secureHeaders['X-CSRF-Token'] = csrfToken;
    }

    // Retry logic for failed requests
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers: secureHeaders,
        });

        // Log suspicious responses
        if (response.status >= 400) {
          await logSecurityEvent({
            event_type: 'suspicious_upload',
            details: {
              url,
              status: response.status,
              attempt,
              timestamp: Date.now()
            },
            severity: response.status >= 500 ? 'high' : 'low'
          });
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('4')) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError!;
  };

  return { makeSecureRequest };
}

// Helper functions
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeInput(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

function getCSRFToken(): string | null {
  // Try to get CSRF token from meta tag or localStorage
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (metaToken) return metaToken;
  
  return localStorage.getItem('csrf_token');
}