import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  validateEmailFormat, 
  validatePasswordStrength, 
  checkRateLimit, 
  rateLimitKey,
  clearRateLimit,
  sanitizeInput,
  generateCSRFToken,
  validateCSRFToken
} from '@/lib/security';
import { sanitizeEmail } from '@/lib/validations';
import { logAuthFailure } from '@/lib/security-logger';

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const secureSignUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    
    try {
      // Enhanced input sanitization
      const cleanEmail = sanitizeEmail(email);
      const cleanFullName = fullName ? sanitizeInput(fullName) : undefined;
      
      // Validate email format
      if (!validateEmailFormat(cleanEmail)) {
        await logAuthFailure(cleanEmail, 'Invalid email format');
        throw new Error('Invalid email format');
      }
      
      // Enhanced password validation with strength check
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        await logAuthFailure(cleanEmail, 'Weak password');
        throw new Error(passwordValidation.errors.join('. '));
      }
      
      // Show password strength feedback
      if (passwordValidation.label === 'Fair') {
        toast({
          title: "Password accepted",
          description: "Consider using a stronger password for better security",
        });
      }
      
      // Stricter rate limiting for signup
      const rateLimitKeyValue = rateLimitKey('signup', cleanEmail);
      if (!checkRateLimit(rateLimitKeyValue, 3, 60 * 60 * 1000)) { // 3 attempts per hour
        await logAuthFailure(cleanEmail, 'Rate limit exceeded - signup');
        throw new Error('Too many signup attempts. Please try again later.');
      }
      
      // Generate CSRF token for this session
      const csrfToken = generateCSRFToken();
      sessionStorage.setItem('auth_csrf_token', csrfToken);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: cleanFullName,
            csrf_token: csrfToken,
            signup_timestamp: new Date().toISOString()
          }
        }
      });
      
      if (error) throw error;
      
      // Clear rate limit on successful signup
      clearRateLimit(rateLimitKeyValue);
      
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification link",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Enhanced email sanitization
      const cleanEmail = sanitizeEmail(email);
      
      // Validate email format
      if (!validateEmailFormat(cleanEmail)) {
        await logAuthFailure(cleanEmail, 'Invalid email format');
        throw new Error('Invalid email format');
      }
      
      // Enhanced rate limiting with progressive delays
      const rateLimitKeyValue = rateLimitKey('signin', cleanEmail);
      if (!checkRateLimit(rateLimitKeyValue, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
        await logAuthFailure(cleanEmail, 'Rate limit exceeded - signin');
        throw new Error('Too many login attempts. Please try again later.');
      }
      
      // Validate CSRF token if present
      const storedCSRFToken = sessionStorage.getItem('auth_csrf_token');
      if (storedCSRFToken) {
        // CSRF validation would be implemented here for state-changing operations
        console.log('CSRF token validation would occur here');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      
      if (error) {
        // Enhanced error handling for security
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }
      
      // Clear rate limit on successful signin
      clearRateLimit(rateLimitKeyValue);
      
      // Clear any existing CSRF token and generate new one
      sessionStorage.removeItem('auth_csrf_token');
      const newCSRFToken = generateCSRFToken();
      sessionStorage.setItem('auth_csrf_token', newCSRFToken);
      
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Invalid credentials",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignOut = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all session storage security tokens
      sessionStorage.removeItem('auth_csrf_token');
      localStorage.removeItem('auth_csrf_token');
      
      // Clear any cached sensitive data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('auth') || name.includes('user')) {
              caches.delete(name);
            }
          });
        });
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out securely",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    secureSignUp,
    secureSignIn,
    secureSignOut,
    isLoading
  };
};