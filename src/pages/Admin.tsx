import React, { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AdminBootstrap } from '@/components/admin/AdminBootstrap';
import { AnalyticsSettings } from '@/components/admin/AnalyticsSettings';
import { SecurityDashboard } from '@/components/admin/SecurityDashboard';
import { AdminSetup } from '@/components/admin/AdminSetup';
import PackageManagement from './admin/PackageManagement';
import ZoneManagement from './admin/ZoneManagement';
import ActivityManagement from './admin/ActivityManagement';

export default function Admin() {
  const { isAdmin, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState("packages");

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

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="mt-6">
            <PackageManagement />
          </TabsContent>
          
          <TabsContent value="zones" className="mt-6">
            <ZoneManagement />
          </TabsContent>
          
          <TabsContent value="activities" className="mt-6">
            <ActivityManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsSettings />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecurityDashboard />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <AdminSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}