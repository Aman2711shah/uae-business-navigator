import { SECURITY_HEADERS } from './security';

/**
 * Content Security Policy configuration
 */
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://ajxbjxoujummahqcctuo.supabase.co'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_POLICY)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Apply CSP header
  headers.set('Content-Security-Policy', generateCSPHeader());
  
  // Apply other security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}