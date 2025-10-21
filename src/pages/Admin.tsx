import React, { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Database, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AdminBootstrap } from '@/components/admin/AdminBootstrap';

import { AnalyticsSettings } from '@/components/admin/AnalyticsSettings';
import { SecurityDashboard } from '@/components/admin/SecurityDashboard';
import { SecurityLogger } from '@/components/admin/SecurityLogger';

export default function Admin() {
  const { isAdmin, loading } = useUserRole();
  const [businessCosts, setBusinessCosts] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasAdminUsers, setHasAdminUsers] = useState<boolean | null>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    checkAdminUsers();
  }, []);

  useEffect(() => {
    if (isAdmin && hasAdminUsers) {
      fetchAdminData();
    }
  }, [isAdmin, hasAdminUsers]);

  const checkAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking admin users:', error);
        setHasAdminUsers(false);
      } else {
        setHasAdminUsers(data && data.length > 0);
      }
    } catch (error) {
      console.error('Error checking admin users:', error);
      setHasAdminUsers(false);
    }
  };

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

      // Fetch service requests with user profiles
      const { data: requests, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching service requests:', requestsError);
      } else {
        setServiceRequests(requests || []);
        setFilteredRequests(requests || []);
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

  useEffect(() => {
    // Filter service requests based on filters
    let filtered = serviceRequests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(req => 
        new Date(req.created_at).toDateString() === new Date(dateFilter).toDateString()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [serviceRequests, statusFilter, dateFilter, searchTerm]);

  if (loading || hasAdminUsers === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show admin bootstrap if no admin users exist
  if (hasAdminUsers === false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminBootstrap />
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
            <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Total applications submitted
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

      {/* Security Dashboard */}
      <SecurityDashboard />

      {/* Security Event Logger */}
      <SecurityLogger />

      <Card>
        <CardHeader>
          <CardTitle>Service Requests Dashboard</CardTitle>
          <CardDescription>
            Monitor and manage all service requests from users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search by request ID, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Service Requests Table */}
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Request ID</th>
                    <th className="text-left p-3">User Email</th>
                    <th className="text-left p-3">User Name</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Documents</th>
                    <th className="text-left p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-xs">{request.request_id}</td>
                      <td className="p-3">{request.profiles?.email || 'N/A'}</td>
                      <td className="p-3">{request.profiles?.full_name || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.document_uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.document_uploaded ? 'Uploaded' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No service requests found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Configuration */}
      <AnalyticsSettings />

      <div className="mt-6">
        <Button onClick={fetchAdminData}>
          Refresh Data
        </Button>
      </div>
      
      
    </div>
  );
}