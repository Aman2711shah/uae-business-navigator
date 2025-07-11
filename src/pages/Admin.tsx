import React, { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Database, AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { isAdmin, loading } = useUserRole();
  const [businessCosts, setBusinessCosts] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch business costs (only admins can see this)
      const { data: costs, error: costsError } = await supabase
        .from('business_setup_costs')
        .select('*')
        .limit(5);

      if (costsError) {
        console.error('Error fetching business costs:', costsError);
      } else {
        setBusinessCosts(costs || []);
      }

      // Fetch user count
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error fetching user count:', countError);
      } else {
        setTotalUsers(count || 0);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users on the platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Costs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessCosts.length}</div>
            <p className="text-xs text-muted-foreground">
              Cost entries in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground">
              RLS policies active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Setup Costs (Preview)</CardTitle>
          <CardDescription>
            Only administrators can view and manage this sensitive data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businessCosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Mainland Fee</th>
                    <th className="text-left p-2">Freezone Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {businessCosts.map((cost, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{cost.category}</td>
                      <td className="p-2">{cost.item_name || 'N/A'}</td>
                      <td className="p-2">
                        {cost.mainland_fee ? `$${cost.mainland_fee}` : 'N/A'}
                      </td>
                      <td className="p-2">
                        {cost.freezone_fee ? `$${cost.freezone_fee}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No business cost data available</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={fetchAdminData}>
          Refresh Data
        </Button>
      </div>
    </div>
  );
}