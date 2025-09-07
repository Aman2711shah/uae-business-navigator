import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApplicationStatus, RecentApplication } from "@/types/trackApplication";
import { TrackApplicationSearch } from "@/components/track-application/TrackApplicationSearch";
import { RecentApplications } from "@/components/track-application/RecentApplications";
import { ApplicationDetails } from "@/components/track-application/ApplicationDetails";
import { supabase } from "@/integrations/supabase/client";


const TrackApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestId, setRequestId] = useState('');
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock recent applications data
  const recentApplications: RecentApplication[] = [
    {
      id: 'SR48936845',
      jurisdiction: 'IFZA',
      status: 'under_review',
      submittedAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 'SR48929011', 
      jurisdiction: 'SPC',
      status: 'approved',
      submittedAt: new Date('2024-01-10').toISOString()
    }
  ];

  useEffect(() => {
    // Check if request ID was passed via navigation state
    if (location.state?.requestId) {
      setRequestId(location.state.requestId);
      handleSearch(location.state.requestId);
    }
  }, [location.state]);

  const handleSearch = async (searchId?: string) => {
    const idToSearch = searchId || requestId;
    if (!idToSearch.trim()) {
      setError('Please enter a valid request ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Call track-application edge function
      const response = await fetch(`https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/track-application?requestId=${encodeURIComponent(idToSearch)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqeGJqeG91anVtbWFocWNjdHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTI4NTYsImV4cCI6MjA2NzU4ODg1Nn0.AO8Ylfjf7bWoGtA1fVZCniQS7vl2IjwHvIjIMQG4f2Q`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch application details');
      }

      const data = await response.json();

      // Convert API response to ApplicationStatus format
      const applicationData: ApplicationStatus = {
        id: data.id,
        status: data.status === 'pending' ? 'under_review' : data.status,
        submittedAt: data.submittedAt,
        lastUpdated: data.lastUpdated,
        jurisdictionType: 'freezone',
        selectedZone: 'General',
        packageName: 'Service Application',
        contactDetails: {
          fullName: data.contactName,
          email: 'Contact support for details',
          phone: 'Contact support for details'
        },
        timeline: data.timeline
      };
      
      setApplication(applicationData);
    } catch (err) {
      console.error('Track application error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application details. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const viewRequest = (id: string) => {
    setRequestId(id);
    handleSearch(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Track Application</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 pb-24">
        {/* Search Section */}
        <TrackApplicationSearch
          requestId={requestId}
          setRequestId={setRequestId}
          onSearch={() => handleSearch()}
          loading={loading}
          error={error}
        />

        {/* Recent Applications */}
        <RecentApplications
          applications={recentApplications}
          onViewRequest={viewRequest}
          getStatusColor={getStatusColor}
        />

        {/* Application Details */}
        {application && (
          <ApplicationDetails
            application={application}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
      
    </div>
  );
};

export default TrackApplication;