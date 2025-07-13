import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApplicationStatus, RecentApplication } from "@/types/trackApplication";
import { TrackApplicationSearch } from "@/components/track-application/TrackApplicationSearch";
import { RecentApplications } from "@/components/track-application/RecentApplications";
import { ApplicationDetails } from "@/components/track-application/ApplicationDetails";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

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
      // Simulate API call - in real app, this would fetch from database
      setTimeout(() => {
        // Mock data for demonstration
        const mockApplication: ApplicationStatus = {
          id: idToSearch,
          status: 'under_review',
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          jurisdictionType: 'freezone',
          selectedZone: 'IFZA',
          packageName: 'Standard Package',
          contactDetails: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+971501234567'
          },
          timeline: [
            {
              step: 'Application Submitted',
              status: 'completed',
              date: new Date().toISOString(),
              description: 'Your application has been successfully submitted'
            },
            {
              step: 'Document Verification',
              status: 'current',
              description: 'Our team is reviewing your submitted documents'
            },
            {
              step: 'Authority Approval',
              status: 'pending',
              description: 'Application will be submitted to relevant authorities'
            },
            {
              step: 'License Issuance',
              status: 'pending',
              description: 'Trade license will be issued upon approval'
            }
          ]
        };
        
        setApplication(mockApplication);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to fetch application details. Please try again.');
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
      <ChatbotWidget />
    </div>
  );
};

export default TrackApplication;