import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Eye, Clock, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  event_type: 'auth_attempt' | 'failed_login' | 'suspicious_activity' | 'admin_action' | 'file_upload';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityLogger() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  // Mock security events (in production, these would come from actual logs)
  const generateMockEvents = (): SecurityEvent[] => {
    const eventTypes: SecurityEvent['event_type'][] = ['auth_attempt', 'failed_login', 'suspicious_activity', 'admin_action', 'file_upload'];
    const severities: SecurityEvent['severity'][] = ['low', 'medium', 'high'];
    const mockEvents: SecurityEvent[] = [];

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      let details = '';
      switch (eventType) {
        case 'auth_attempt':
          details = 'User authentication successful';
          break;
        case 'failed_login':
          details = 'Failed login attempt with invalid credentials';
          break;
        case 'suspicious_activity':
          details = 'Multiple rapid requests detected';
          break;
        case 'admin_action':
          details = 'Admin user accessed sensitive data';
          break;
        case 'file_upload':
          details = 'File uploaded to community images bucket';
          break;
      }

      mockEvents.push({
        id: `event_${i}`,
        timestamp,
        event_type: eventType,
        user_email: `user${i}@example.com`,
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        details,
        severity
      });
    }

    return mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const fetchSecurityEvents = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a security_events table
      // For now, we'll generate mock data
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch security events"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (severityFilter !== 'all') {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.event_type === typeFilter);
    }

    setFilteredEvents(filtered);
  }, [events, severityFilter, typeFilter]);

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: SecurityEvent['event_type']) => {
    switch (type) {
      case 'auth_attempt':
        return <Shield className="h-3 w-3" />;
      case 'failed_login':
        return <AlertTriangle className="h-3 w-3" />;
      case 'suspicious_activity':
        return <Eye className="h-3 w-3" />;
      case 'admin_action':
        return <Shield className="h-3 w-3" />;
      case 'file_upload':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Security Event Log</CardTitle>
              <CardDescription>
                Monitor and track security-related events in real-time
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityEvents}
            disabled={isLoading}
          >
            Refresh Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auth_attempt">Auth Attempts</SelectItem>
              <SelectItem value="failed_login">Failed Logins</SelectItem>
              <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              <SelectItem value="admin_action">Admin Actions</SelectItem>
              <SelectItem value="file_upload">File Uploads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.event_type)}
                    <span className="font-medium capitalize">
                      {event.event_type.replace('_', ' ')}
                    </span>
                    <Badge variant="secondary" className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{event.details}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {event.user_email && <span>User: {event.user_email}</span>}
                  {event.ip_address && <span>IP: {event.ip_address}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No security events found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}