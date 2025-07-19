import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkAdminStatus = async () => {
    setIsLoading(true);
    setStatus('checking');
    
    try {
      const { data, error } = await supabase.rpc('setup_initial_admin');
      
      if (error) {
        setStatus('error');
        setMessage(error.message);
        toast.error('Failed to check admin status');
      } else {
        setStatus('success');
        setMessage(data || 'Admin status checked successfully');
        toast.success(data || 'Admin status checked');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to check admin status');
      toast.error('Failed to check admin status');
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async () => {
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStatus('checking');
    
    try {
      const { data, error } = await supabase.rpc('create_initial_admin', { 
        admin_email: email.trim() 
      });
      
      if (error) {
        setStatus('error');
        setMessage(error.message);
        toast.error(error.message);
      } else {
        setStatus('success');
        setMessage('Admin user created successfully');
        toast.success('Admin user created successfully');
        setEmail('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to create admin user');
      toast.error('Failed to create admin user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Admin Setup
        </CardTitle>
        <CardDescription>
          Check admin status or create the initial admin user for your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkAdminStatus} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading && status === 'checking' ? 'Checking...' : 'Check Admin Status'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or create admin
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button 
          onClick={createAdmin} 
          disabled={isLoading || !email.trim()}
          className="w-full"
        >
          {isLoading && status === 'checking' ? 'Creating...' : 'Create Admin User'}
        </Button>

        {message && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};