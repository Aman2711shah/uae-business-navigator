import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  validateEmailFormat, 
  validatePasswordStrength, 
  checkRateLimit, 
  rateLimitKey,
  clearRateLimit 
} from '@/lib/security';
import { sanitizeInput } from '@/lib/validations';

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const secureSignUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    
    try {
      // Sanitize inputs
      const cleanEmail = sanitizeInput(email.toLowerCase());
      const cleanFullName = fullName ? sanitizeInput(fullName) : undefined;
      
      // Validate email format
      if (!validateEmailFormat(cleanEmail)) {
        throw new Error('Invalid email format');
      }
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join('. '));
      }
      
      // Check rate limiting
      const rateLimitKeyValue = rateLimitKey('signup', cleanEmail);
      if (!checkRateLimit(rateLimitKeyValue, 3, 60 * 60 * 1000)) { // 3 attempts per hour
        throw new Error('Too many signup attempts. Please try again later.');
      }
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: cleanFullName
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
      // Sanitize email input
      const cleanEmail = sanitizeInput(email.toLowerCase());
      
      // Validate email format
      if (!validateEmailFormat(cleanEmail)) {
        throw new Error('Invalid email format');
      }
      
      // Check rate limiting
      const rateLimitKeyValue = rateLimitKey('signin', cleanEmail);
      if (!checkRateLimit(rateLimitKeyValue, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
        throw new Error('Too many login attempts. Please try again later.');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      
      if (error) throw error;
      
      // Clear rate limit on successful signin
      clearRateLimit(rateLimitKeyValue);
      
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
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
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