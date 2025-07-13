import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentApplication } from "@/types/trackApplication";

interface RecentApplicationsProps {
  applications: RecentApplication[];
  onViewRequest: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
  onViewRequest,
  getStatusColor
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Request ID: {app.id}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>Jurisdiction: {app.jurisdiction}</span>
                    <span>•</span>
                    <span>Status: 
                      <Badge 
                        variant="secondary" 
                        className={`ml-1 ${getStatusColor(app.status)}`}
                      >
                        {app.status === 'under_review' ? 'Under Review' : 
                         app.status === 'approved' ? 'Completed' : 
                         app.status.replace('_', ' ')}
                      </Badge>
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewRequest(app.id)}
                  className="ml-4"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};