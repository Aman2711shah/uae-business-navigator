import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { validateEmailFormat } from '@/lib/security';

export const AdminBootstrap: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Email is required');
      }

      // Validate email format
      if (!validateEmailFormat(email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase.rpc('create_initial_admin', {
        admin_email: email.trim()
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Initial admin user created successfully! Please refresh the page.",
        variant: "default",
      });

      setEmail('');
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        variant: "destructive",
        title: "Error creating admin",
        description: error.message || "Failed to create admin user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Security Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700">
          <strong>Security Setup Required:</strong> No admin users found in the system. 
          Creating an admin user is required to access administrative functions and maintain system security.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Create Initial Admin User</CardTitle>
          </div>
          <CardDescription>
            Set up the first admin user to secure your application. This admin will have full system access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Admin Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This email must belong to an existing registered user
              </p>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              <User className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Security Features Active:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Row Level Security (RLS) policies enforced</li>
                  <li>• Input sanitization and validation enabled</li>
                  <li>• Rate limiting for sensitive operations</li>
                  <li>• Secure authentication with strong passwords</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Next Steps:</strong>
                <ol className="mt-2 space-y-1 text-sm list-decimal list-inside">
                  <li>Ensure the user account exists (sign up first if needed)</li>
                  <li>Create the admin user using the form above</li>
                  <li>Log in with the admin account to access the dashboard</li>
                  <li>Configure additional security settings as needed</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};