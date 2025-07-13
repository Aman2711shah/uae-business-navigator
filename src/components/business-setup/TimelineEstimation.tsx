import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimelineEstimationProps {
  entityType: string;
  freezoneName?: string;
  isFreezone: boolean;
}

const TimelineEstimation: React.FC<TimelineEstimationProps> = ({ 
  entityType, 
  freezoneName,
  isFreezone 
}) => {
  const { data: timelineData, isLoading } = useQuery({
    queryKey: ["timeline-estimates", entityType, freezoneName],
    queryFn: async () => {
      let query = supabase
        .from("timeline_estimates")
        .select("*")
        .eq("entity_type", entityType);
      
      if (isFreezone && freezoneName) {
        query = query.or(`freezone_name.eq.${freezoneName},freezone_name.is.null`);
      }
      
      const { data, error } = await query.order("process_step");
      
      if (error) throw error;
      return data;
    },
  });

  const getStepIcon = (step: string) => {
    switch (step.toLowerCase()) {
      case 'document preparation':
        return <FileText className="h-5 w-5" />;
      case 'license application':
        return <CheckCircle className="h-5 w-5" />;
      case 'visa processing':
        return <Calendar className="h-5 w-5" />;
      case 'bank account opening':
        return <Clock className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const totalDays = timelineData?.reduce((sum, item) => sum + item.estimated_days, 0) || 0;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">⏱️ Timeline Estimation</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {totalDays} business days
          </Badge>
        </div>

        <div className="space-y-4">
          {timelineData?.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getStepIcon(item.process_step)}
                </div>
                {index < timelineData.length - 1 && (
                  <div className="w-px h-6 bg-border mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{item.process_step}</h4>
                  <Badge variant="secondary">
                    {item.estimated_days} {item.estimated_days === 1 ? 'day' : 'days'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                {item.freezone_name && (
                  <p className="text-xs text-primary mt-1">Specific to {item.freezone_name}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-900">Fast Track Available</span>
          </div>
          <p className="text-sm text-green-700">
            Complete setup in as little as {Math.ceil(totalDays * 0.6)} days with our premium service
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TimelineEstimation;