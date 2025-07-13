import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface UserAnalyticsProps {
  stats: {
    activeServices: number;
    completedServices: number;
    inProgressServices: number;
    monthlyProgress: number;
    completionRate: number;
  };
}

export const UserAnalytics = ({ stats }: UserAnalyticsProps) => {
  const metrics = [
    {
      title: "Monthly Progress",
      value: `${stats.monthlyProgress}%`,
      progress: stats.monthlyProgress,
      icon: TrendingUp,
      color: "text-brand-blue",
      description: "Goals achieved this month"
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      progress: stats.completionRate,
      icon: CheckCircle,
      color: "text-brand-green",
      description: "Services completed successfully"
    },
    {
      title: "Active Projects",
      value: stats.inProgressServices.toString(),
      progress: (stats.inProgressServices / 10) * 100,
      icon: Clock,
      color: "text-brand-orange",
      description: "Currently in progress"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Performance</h3>
      
      <div className="grid gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{metric.title}</h4>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};