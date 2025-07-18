import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: 'auth_failure' | 'suspicious_upload' | 'rate_limit_exceeded' | 'admin_action' | 'xss_attempt' | 'sql_injection_attempt';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Log security events for monitoring and analysis
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // In a real application, you would send this to a dedicated security logging service
    // For now, we'll log to console and optionally store in database
    console.warn('Security Event:', {
      timestamp: new Date().toISOString(),
      ...event
    });

    // Store critical events in database for admin review
    // TODO: Create security_logs table if needed for persistent storage
    if (event.severity === 'critical' || event.severity === 'high') {
      // For now, just enhanced console logging for critical events
      console.error('CRITICAL SECURITY EVENT:', {
        timestamp: new Date().toISOString(),
        ...event
      });
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