import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatus } from "@/types/trackApplication";

interface ContactInformationProps {
  contactDetails: ApplicationStatus['contactDetails'];
}

export const ContactInformation: React.FC<ContactInformationProps> = ({ contactDetails }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{contactDetails.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{contactDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{contactDetails.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};