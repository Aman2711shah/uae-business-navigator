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
 * Apply security headers to response (server-side)
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

/**
 * Apply security headers via meta tags (client-side)
 */
export function applyClientSecurityHeaders(): void {
  // Remove existing security meta tags
  document.querySelectorAll('meta[http-equiv^="Content-Security-Policy"], meta[http-equiv^="X-"]')
    .forEach(tag => tag.remove());

  // Apply CSP via meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = generateCSPHeader();
  document.head.appendChild(cspMeta);

  // Apply other security headers as meta tags
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    if (key.startsWith('X-')) {
      const meta = document.createElement('meta');
      meta.httpEquiv = key;
      meta.content = value;
      document.head.appendChild(meta);
    }
  });

  // Add referrer policy
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(referrerMeta);
}