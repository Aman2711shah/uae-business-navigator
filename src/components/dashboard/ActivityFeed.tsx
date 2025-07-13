import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react";

interface Activity {
  id: string;
  type: 'completed' | 'pending' | 'scheduled' | 'document';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return AlertCircle;
      case 'scheduled':
        return Calendar;
      case 'document':
        return FileText;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'completed':
        return 'text-brand-green';
      case 'pending':
        return 'text-brand-orange';
      case 'scheduled':
        return 'text-brand-blue';
      case 'document':
        return 'text-brand-purple';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (type: Activity['type']) => {
    switch (type) {
      case 'completed':
        return <Badge className="bg-brand-green/10 text-brand-green border-brand-green/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/20">Scheduled</Badge>;
      case 'document':
        return <Badge className="bg-brand-purple/10 text-brand-purple border-brand-purple/20">Document</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1`}>
                <IconComponent className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                  {getStatusBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};