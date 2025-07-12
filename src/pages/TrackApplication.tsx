import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface ApplicationStatus {
  id: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  lastUpdated: string;
  jurisdictionType: string;
  selectedZone: string;
  packageName: string;
  contactDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  timeline: {
    step: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
    description: string;
  }[];
}

const TrackApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestId, setRequestId] = useState('');
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const getTimelineIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Your Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="requestId">Service Request ID</Label>
                <Input
                  id="requestId"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="Enter your request ID (e.g., SR48936845)"
                />
              </div>
              <Button 
                onClick={() => handleSearch()}
                disabled={loading || !requestId.trim()}
                className="w-full"
              >
                {loading ? "Searching..." : "Search Application"}
              </Button>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        {application && (
          <>
            {/* Status Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Application Details
                  </span>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Request ID</p>
                    <p className="font-mono font-semibold">{application.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jurisdiction</p>
                    <p className="font-medium">{application.selectedZone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-medium">{application.packageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="font-medium">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getTimelineIcon(item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            item.status === 'current' ? 'text-blue-600' : 
                            item.status === 'completed' ? 'text-green-600' : 
                            'text-gray-500'
                          }`}>
                            {item.step}
                          </h4>
                          {item.date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{application.contactDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{application.contactDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{application.contactDetails.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;