// Enhanced rate limiting for security

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

class SecurityRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private configs: Record<string, RateLimitConfig> = {
    // Authentication attempts
    'auth:login': { windowMs: 15 * 60 * 1000, maxAttempts: 5, blockDurationMs: 30 * 60 * 1000 },
    'auth:signup': { windowMs: 60 * 60 * 1000, maxAttempts: 3, blockDurationMs: 60 * 60 * 1000 },
    
    // Form submissions
    'submit:application': { windowMs: 5 * 60 * 1000, maxAttempts: 3, blockDurationMs: 15 * 60 * 1000 },
    'submit:lead': { windowMs: 5 * 60 * 1000, maxAttempts: 2, blockDurationMs: 10 * 60 * 1000 },
    
    // File uploads
    'upload:document': { windowMs: 10 * 60 * 1000, maxAttempts: 10, blockDurationMs: 20 * 60 * 1000 },
    
    // API calls
    'api:general': { windowMs: 60 * 1000, maxAttempts: 60, blockDurationMs: 5 * 60 * 1000 },
    
    // Password attempts
    'password:reset': { windowMs: 60 * 60 * 1000, maxAttempts: 3, blockDurationMs: 60 * 60 * 1000 }
  };

  generateKey(action: string, identifier: string): string {
    return `${action}:${identifier}`;
  }

  check(action: string, identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = this.configs[action] || this.configs['api:general'];
    const key = this.generateKey(action, identifier);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup();
    
    const record = this.store.get(key);
    
    // Check if currently blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blockedUntil
      };
    }
    
    // Initialize or reset window
    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      };
    }
    
    // Check if limit exceeded
    if (record.count >= config.maxAttempts) {
      // Block the identifier
      record.blockedUntil = now + config.blockDurationMs;
      this.store.set(key, record);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blockedUntil
      };
    }
    
    // Increment counter
    record.count++;
    this.store.set(key, record);
    
    return {
      allowed: true,
      remaining: config.maxAttempts - record.count,
      resetTime: record.resetTime
    };
  }

  reset(action: string, identifier: string): void {
    const key = this.generateKey(action, identifier);
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime && (!record.blockedUntil || now > record.blockedUntil)) {
        this.store.delete(key);
      }
    }
  }

  // Get current status without affecting the counter
  getStatus(action: string, identifier: string): { blocked: boolean; remaining: number; resetTime: number } {
    const config = this.configs[action] || this.configs['api:general'];
    const key = this.generateKey(action, identifier);
    const now = Date.now();
    const record = this.store.get(key);
    
    if (!record) {
      return { blocked: false, remaining: config.maxAttempts, resetTime: 0 };
    }
    
    if (record.blockedUntil && now < record.blockedUntil) {
      return { blocked: true, remaining: 0, resetTime: record.blockedUntil };
    }
    
    if (now > record.resetTime) {
      return { blocked: false, remaining: config.maxAttempts, resetTime: 0 };
    }
    
    return {
      blocked: false,
      remaining: Math.max(0, config.maxAttempts - record.count),
      resetTime: record.resetTime
    };
  }
}

export const rateLimiter = new SecurityRateLimiter();

// Utility function to get client IP (fallback approach for browser)
export const getClientIP = (): string => {
  // In a browser environment, we can't get the real IP
  // Use a combination of user agent and other identifiers
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  
  // Create a pseudo-IP based on browser fingerprint
  const fingerprint = btoa(`${userAgent}-${language}-${platform}`).substring(0, 15);
  return `browser-${fingerprint}`;
};