import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | 'entrepreneur' | 'consultant';

interface UserRoleProfile {
  role: UserRole;
  permissions: string[];
  dashboardConfig: {
    showAdvancedFeatures: boolean;
    showClientManagement: boolean;
    showAnalytics: boolean;
    showBulkOperations: boolean;
  };
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [roleProfile, setRoleProfile] = useState<UserRoleProfile>({
    role: 'user',
    permissions: [],
    dashboardConfig: {
      showAdvancedFeatures: false,
      showClientManagement: false,
      showAnalytics: false,
      showBulkOperations: false
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRoleProfile({
          role: 'user',
          permissions: ['basic'],
          dashboardConfig: {
            showAdvancedFeatures: false,
            showClientManagement: false,
            showAnalytics: false,
            showBulkOperations: false
          }
        });
        setLoading(false);
        return;
      }

      try {
        // Check for admin role first
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (adminRole) {
          setRoleProfile({
            role: 'admin',
            permissions: ['all'],
            dashboardConfig: {
              showAdvancedFeatures: true,
              showClientManagement: true,
              showAnalytics: true,
              showBulkOperations: true
            }
          });
          setLoading(false);
          return;
        }

        // Check user profile or business stage to determine entrepreneur vs consultant
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: communityProfile } = await supabase
          .from('community_users')
          .select('business_type, business_stage')
          .eq('user_id', user.id)
          .single();

        // Determine role based on profile
        let detectedRole: UserRole = 'entrepreneur';
        
        if (communityProfile?.business_type === 'Consulting' || 
            communityProfile?.business_type === 'Legal Services' ||
            profile?.full_name?.toLowerCase().includes('consultant')) {
          detectedRole = 'consultant';
        }

        const roleConfig = {
          entrepreneur: {
            role: 'entrepreneur' as UserRole,
            permissions: ['basic', 'save_quotes', 'track_applications'],
            dashboardConfig: {
              showAdvancedFeatures: false,
              showClientManagement: false,
              showAnalytics: false,
              showBulkOperations: false
            }
          },
          consultant: {
            role: 'consultant' as UserRole,
            permissions: ['basic', 'save_quotes', 'track_applications', 'client_management'],
            dashboardConfig: {
              showAdvancedFeatures: true,
              showClientManagement: true,
              showAnalytics: true,
              showBulkOperations: false
            }
          }
        };

        setRoleProfile(roleConfig[detectedRole]);

      } catch (error) {
        console.error('Error fetching user role:', error);
        setRoleProfile({
          role: 'entrepreneur',
          permissions: ['basic'],
          dashboardConfig: {
            showAdvancedFeatures: false,
            showClientManagement: false,
            showAnalytics: false,
            showBulkOperations: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasPermission = (permission: string) => {
    return roleProfile.permissions.includes('all') || roleProfile.permissions.includes(permission);
  };

  const isAdmin = roleProfile.role === 'admin';
  const isConsultant = roleProfile.role === 'consultant';
  const isEntrepreneur = roleProfile.role === 'entrepreneur';

  return { 
    ...roleProfile,
    hasPermission,
    isAdmin,
    isConsultant, 
    isEntrepreneur,
    loading 
  };
};