import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { ApplicationStatus } from "@/types/trackApplication";

interface ApplicationTimelineProps {
  timeline: ApplicationStatus['timeline'];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ timeline }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Application Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
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
  );
};