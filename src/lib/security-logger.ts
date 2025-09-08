import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

export interface SecurityEvent {
  event_type: 'auth_failure' | 'suspicious_upload' | 'rate_limit_exceeded' | 'admin_action' | 'xss_attempt' | 'sql_injection_attempt';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Filter out false positives for CSP and security headers
const isSecurityHeaderEvent = (event: SecurityEvent): boolean => {
  if (event.event_type !== 'xss_attempt') return false;
  
  const element = event.details?.element || '';
  const securityHeaderPatterns = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy',
    'Permissions-Policy',
    '<meta name="referrer"',
    '<meta http-equiv="Content-Security-Policy"',
    '<meta http-equiv="X-Frame-Options"',
    '<meta http-equiv="X-Content-Type-Options"',
    'name="referrer"',
    'http-equiv='
  ];
  
  return securityHeaderPatterns.some(pattern => element.includes(pattern));
};

/**
 * Log security events for monitoring and analysis
 * Filters out false positives from legitimate security headers
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // Filter out false positives for security headers
    if (isSecurityHeaderEvent(event)) {
      logger.debug('Filtered out security header false positive:', event.details);
      return;
    }

    // Log to console for immediate debugging
    logger.security('Security Event:', {
      timestamp: new Date().toISOString(),
      ...event
    });

    // Store critical and high severity events in database for admin review
    if (event.severity === 'critical' || event.severity === 'high') {
      logger.error('CRITICAL SECURITY EVENT:', {
        timestamp: new Date().toISOString(),
        ...event
      });
    }

    // Log to database using the log_security_event function
    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: event.event_type,
        user_id: event.user_id || null,
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || null,
        details: event.details || null,
        severity: event.severity || 'low'
      });
      
      if (error) {
        console.warn('Failed to log security event to database:', error);
      }
    } catch (dbError) {
      console.warn('Database security logging failed:', dbError);
    }
    
  } catch (error) {
    // Never let security logging break the application
    console.error('Failed to log security event:', error);
  }
}

/**
 * Log authentication failures
 */
export async function logAuthFailure(
  email: string,
  reason: string,
  ip?: string,
  userAgent?: string
): Promise<void> {
  await logSecurityEvent({
    event_type: 'auth_failure',
    ip_address: ip,
    user_agent: userAgent,
    details: {
      email,
      reason,
      timestamp: Date.now()
    },
    severity: 'medium'
  });
}

/**
 * Log suspicious file uploads
 */
export async function logSuspiciousUpload(
  userId: string,
  filename: string,
  reason: string,
  ip?: string
): Promise<void> {
  await logSecurityEvent({
    event_type: 'suspicious_upload',
    user_id: userId,
    ip_address: ip,
    details: {
      filename,
      reason,
      timestamp: Date.now()
    },
    severity: 'high'
  });
}

/**
 * Log rate limit exceeded events
 */
export async function logRateLimitExceeded(
  userId: string,
  action: string,
  ip?: string
): Promise<void> {
  await logSecurityEvent({
    event_type: 'rate_limit_exceeded',
    user_id: userId,
    ip_address: ip,
    details: {
      action,
      timestamp: Date.now()
    },
    severity: 'medium'
  });
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logSecurityEvent({
    event_type: 'admin_action',
    user_id: adminId,
    details: {
      action,
      target_user_id: targetUserId,
      ...details,
      timestamp: Date.now()
    },
    severity: 'medium'
  });
}