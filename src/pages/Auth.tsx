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
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string }>({
    score: 0,
    label: 'Weak'
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { secureSignUp, secureSignIn, isLoading } = useSecureAuth();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validateField = (field: string, value: string, isSignUp: boolean = false) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case "email":
        if (!validateEmailFormat(value)) {
          errors.email = "Please enter a valid email address";
        }
        break;

      case "password": {
        const passwordValidation = validatePasswordStrength(value);
        if (!passwordValidation.isValid) {
          const filteredErrors = passwordValidation.errors.filter(
            (err) => !err.toLowerCase().includes("common")
          );
          errors.password = filteredErrors[0] || "Invalid password";
        }

        // ✅ Directly use score + label from security.ts
        if (isSignUp) {
          setPasswordStrength({
            score: passwordValidation.score,
            label: passwordValidation.label,
          });
        }
        break;
      }

      case "fullName":
        if (isSignUp && (!value.trim() || value.length < 2)) {
          errors.fullName = "Full name must be at least 2 characters";
        }
        break;

      case "phone":
        if (isSignUp && value) {
          const phoneValidation = normalizePhone(value);
          if (!phoneValidation.isValid) {
            errors.phone = phoneValidation.error || "Invalid phone number";
          }
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const validateForm = (isSignUp: boolean = false) => {
    const fields = isSignUp
      ? ["email", "password", "fullName", "phone"]
      : ["email", "password"];

    let errors: Record<string, string> = {};
    for (const field of fields) {
      const value =
        field === "email"
          ? email
          : field === "password"
          ? password
          : field === "fullName"
          ? fullName
          : phone;

      errors = { ...errors, ...validateField(field, value, isSignUp) };
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
        // Success - let user confirm email before signing in
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

            {/* --- Sign In --- */}
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
                    aria-describedby={validationErrors.email ? "signin-email-error" : undefined}
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
                    aria-describedby={validationErrors.password ? "signin-password-error" : undefined}
                  />
                  {validationErrors.password && (
                    <p id="signin-password-error" className="text-sm text-destructive">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* --- Sign Up --- */}
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
                    aria-describedby={validationErrors.fullName ? "signup-name-error" : undefined}
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
                    aria-describedby={validationErrors.email ? "signup-email-error" : undefined}
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
                    aria-describedby={validationErrors.phone ? "signup-phone-error" : undefined}
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
                    aria-describedby={validationErrors.password ? "signup-password-error" : undefined}
                  />
                  {validationErrors.password && (
                    <p id="signup-password-error" className="text-sm text-destructive">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* ✅ Password strength meter */}
                {password && (
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded bg-muted">
                      <div
                        className={`h-2 rounded transition-all ${
                          passwordStrength.score <= 25
                            ? "bg-red-500"
                            : passwordStrength.score <= 50
                            ? "bg-orange-500"
                            : passwordStrength.score <= 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {passwordStrength.label}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
