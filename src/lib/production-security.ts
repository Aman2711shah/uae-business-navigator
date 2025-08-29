/**
 * Production Security Configuration
 * 
 * This file contains security configurations that should be applied in production
 * to complement the existing security measures.
 */

import { applyClientSecurityHeaders } from './csp';

/**
 * Initialize all production security measures
 */
export const initializeProductionSecurity = () => {
  // Apply security headers
  applyClientSecurityHeaders();
  
  // Additional runtime security measures
  if (typeof window !== 'undefined') {
    // Prevent clickjacking
    preventClickjacking();
    
    // Clear sensitive data on page load
    clearSensitiveData();
    
    // Monitor for potential XSS attempts
    setupXSSMonitoring();
    
    // Disable certain browser features that could be exploited
    disableRiskyFeatures();
  }
};

/**
 * Prevent clickjacking attacks
 */
const preventClickjacking = () => {
  try {
    if (window.self !== window.top) {
      window.top!.location = window.self.location;
    }
  } catch (e) {
    // Frame-busting protection
    document.write('<style>body { display: none !important; }</style>');
    setTimeout(() => {
      document.body.style.display = 'block';
    }, 100);
  }
};

/**
 * Clear potentially sensitive data from storage
 */
const clearSensitiveData = () => {
  const sensitiveKeys = [
    'temp_password',
    'temp_token', 
    'reset_token',
    'temp_auth',
    'csrf_temp'
  ];
  
  sensitiveKeys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

/**
 * Setup basic XSS monitoring
 */
const setupXSSMonitoring = () => {
  // Monitor for suspicious script injections
  const originalAppendChild = Node.prototype.appendChild;
  const originalInsertBefore = Node.prototype.insertBefore;
  
  const checkSuspiciousContent = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName?.toLowerCase();
      
      // Check for suspicious script tags or inline event handlers
      if (tagName === 'script' || 
          element.innerHTML?.includes('javascript:') ||
          element.outerHTML?.match(/on\w+\s*=/i)) {
        
        console.warn('Potential XSS attempt detected:', {
          element: element.outerHTML?.substring(0, 200),
          location: window.location.href
        });
        
        // In production, you might want to report this to your security logging
        import('./security-logger').then(({ logSecurityEvent }) => {
          logSecurityEvent({
            event_type: 'xss_attempt',
            details: {
              element: element.outerHTML?.substring(0, 200),
              location: window.location.href,
              userAgent: navigator.userAgent
            },
            severity: 'high'
          });
        });
      }
    }
  };
  
  Node.prototype.appendChild = function(node: Node) {
    checkSuspiciousContent(node);
    return originalAppendChild.call(this, node);
  };
  
  Node.prototype.insertBefore = function(node: Node, referenceNode: Node | null) {
    checkSuspiciousContent(node);
    return originalInsertBefore.call(this, node, referenceNode);
  };
};

/**
 * Disable risky browser features that could be exploited
 */
const disableRiskyFeatures = () => {
  // Disable eval() if not already disabled
  try {
    window.eval = () => {
      throw new Error('eval() is disabled for security reasons');
    };
  } catch (e) {
    // eval might already be disabled
  }
  
  // Disable Function constructor
  try {
    (window as any).Function = () => {
      throw new Error('Function constructor is disabled for security reasons');
    };
  } catch (e) {
    // Function constructor might already be disabled
  }
};

/**
 * Security Configuration Checklist for Manual Setup
 * These items require manual configuration in Supabase dashboard:
 */
export const MANUAL_SECURITY_CHECKLIST = {
  supabase_auth: {
    otp_expiry: 'Set OTP/Magic link expiry to 300 seconds (5 minutes) in Auth > Settings',
    password_protection: 'Enable "Password breach protection" in Auth > Settings > Password Security',
    rate_limiting: 'Review rate limiting settings in Auth > Rate Limits'
  },
  database: {
    rls_policies: 'All tables have appropriate RLS policies ✓',
    function_security: 'All functions use SECURITY DEFINER with search_path ✓',
    logging: 'Security events table created ✓'
  },
  production: {
    ssl: 'Ensure SSL/TLS is enabled for all connections',
    monitoring: 'Set up alerts for security events in production',
    backups: 'Configure encrypted backups',
    audit_logs: 'Enable database audit logging if required'
  }
};