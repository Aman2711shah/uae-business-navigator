import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ApplicationStatus } from "@/types/trackApplication";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { ContactInformation } from "./ContactInformation";

interface ApplicationDetailsProps {
  application: ApplicationStatus;
  getStatusColor: (status: string) => string;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  getStatusColor
}) => {
  return (
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
      <ApplicationTimeline timeline={application.timeline} />

      {/* Contact Information */}
      <ContactInformation contactDetails={application.contactDetails} />
    </>
  );
};