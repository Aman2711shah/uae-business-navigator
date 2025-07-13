import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CheckCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analytics, useAnalytics } from "@/lib/analytics";

export const AnalyticsSettings: React.FC = () => {
  const [trackingId, setTrackingId] = useState("");
  const [currentTrackingId, setCurrentTrackingId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const analyticsHook = useAnalytics();

  useEffect(() => {
    // Load current tracking ID from localStorage
    const savedTrackingId = localStorage.getItem('ga4-tracking-id');
    if (savedTrackingId) {
      setCurrentTrackingId(savedTrackingId);
      setTrackingId(savedTrackingId);
    }
  }, []);

  const handleSaveTrackingId = async () => {
    if (!trackingId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid GA4 Tracking ID"
      });
      return;
    }

    // Validate GA4 format (G-XXXXXXXXXX)
    const ga4Pattern = /^G-[A-Z0-9]{10}$/;
    if (!ga4Pattern.test(trackingId.trim())) {
      toast({
        variant: "destructive", 
        title: "Invalid Format",
        description: "GA4 Tracking ID should be in format G-XXXXXXXXXX"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      analyticsHook.setTrackingId(trackingId.trim());
      setCurrentTrackingId(trackingId.trim());
      
      toast({
        title: "Success",
        description: "Google Analytics tracking has been configured successfully"
      });

      // Track this configuration change
      analyticsHook.track('analytics_configured', {
        tracking_id: trackingId.trim(),
        configured_at: Date.now()
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Failed to configure Google Analytics"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTracking = () => {
    if (!currentTrackingId) {
      toast({
        variant: "destructive",
        title: "No Tracking ID",
        description: "Please configure your GA4 Tracking ID first"
      });
      return;
    }

    // Send test event
    analyticsHook.track('test_event', {
      test_parameter: 'admin_panel_test',
      timestamp: Date.now()
    });

    toast({
      title: "Test Event Sent",
      description: "Check your Google Analytics dashboard for the test event"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Google Analytics Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure Google Analytics 4 (GA4) tracking for your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Status:</span>
          </div>
          {currentTrackingId ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Configured
            </Badge>
          ) : (
            <Badge variant="secondary">Not Configured</Badge>
          )}
        </div>

        {/* Current Tracking ID Display */}
        {currentTrackingId && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Tracking ID</Label>
            <div className="p-2 bg-muted rounded font-mono text-sm">
              {currentTrackingId}
            </div>
          </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-id">GA4 Tracking ID</Label>
            <Input
              id="tracking-id"
              placeholder="G-XXXXXXXXXX"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveTrackingId}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
            
            {currentTrackingId && (
              <Button 
                variant="outline" 
                onClick={handleTestTracking}
                className="px-6"
              >
                Test Tracking
              </Button>
            )}
          </div>
        </div>

        {/* Tracked Events Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Tracked Events:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Badge variant="outline" className="justify-center py-2">
              Application_Started
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Application_Submitted
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Document_Uploaded
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              Feedback_Received
            </Badge>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="p-3 bg-blue-50 rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-blue-900">Setup Instructions:</h4>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Create a GA4 property in Google Analytics</li>
            <li>Copy your Measurement ID (starts with G-)</li>
            <li>Paste it in the field above and save</li>
            <li>Use the "Test Tracking" button to verify setup</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};