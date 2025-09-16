import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validateEmailFormat, validatePasswordStrength } from '@/lib/security';
import { normalizePhone } from '@/lib/validation';
import { logger } from '@/lib/logger';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { secureSignUp, secureSignIn, isLoading } = useSecureAuth();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const mapPasswordError = (error: string): string => {
    const err = error.toLowerCase();

    if (err.includes('length')) return 'Password must be at least 12 characters long';
    if (err.includes('uppercase')) return 'Password needs at least one uppercase letter';
    if (err.includes('lowercase')) return 'Password needs at least one lowercase letter';
    if (err.includes('digit') || err.includes('number')) return 'Password needs at least one number';
    if (err.includes('special') || err.includes('symbol')) return 'Password needs at least one special character (e.g., !@#$)';
    if (err.includes('common')) return ''; // ignored completely

    return 'Invalid password';
  };

  const validateForm = (isSignUp: boolean = false) => {
    const errors: Record<string, string> = {};

    // Validate email
    if (!validateEmailFormat(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      const filteredErrors = passwordValidation.errors
        .filter((err) => !err.toLowerCase().includes('common'))
        .map(mapPasswordError)
        .filter(Boolean); // remove empty ones
      if (filteredErrors.length > 0) {
        errors.password = filteredErrors[0];
      }
    }

    // For sign up, validate additional fields
    if (isSignUp) {
      if (!fullName.trim() || fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      }

      if (phone) {
        const phoneValidation = normalizePhone(phone);
        if (!phoneValidation.isValid) {
          errors.phone = phoneValidation.error || 'Invalid phone number';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    try {
      const result = await secureSignIn(email, password);
      if (!result.error) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      logger.error('Sign in error:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    try {
      const result = await secureSignUp(email, password, fullName);
      if (!result.error) {
        // Success - but user needs to confirm email before signing in
        // Don't navigate automatically, let them know to check email
      }
    } catch (error) {
      logger.error('Sign up error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Access your business setup and growth tools. Check your email after signing up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby={validationErrors.email ? 'signin-email-error' : undefined}
                  />
                  {validationErrors.email && (
                    <p id="signin-email-error" className="text-sm text-destructive">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-describedby={validationErrors.password ? 'signin-password-error' : undefined}
                  />
                  {validationErrors.password && (
                    <p id="signin-password-error" className="text-sm text-destructive">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    aria-describedby={validationErrors.fullName ? 'signup-name-error' : undefined}
                  />
                  {validationErrors.fullName && (
                    <p id="signup-name-error" className="text-sm text-destructive">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby={validationErrors.email ? 'signup-email-error' : undefined}
                  />
                  {validationErrors.email && (
                    <p id="signup-email-error" className="text-sm text-destructive">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number (e.g., +971501234567)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-describedby={validationErrors.phone ? 'signup-phone-error' : undefined}
                  />
                  {validationErrors.phone && (
                    <p id="signup-phone-error" className="text-sm text-destructive">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 12 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={12}
                    aria-describedby={validationErrors.password ? 'signup-password-error' : undefined}
                  />
                  {validationErrors.password && (
                    <p id="signup-password-error" className="text-sm text-destructive">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
