import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageCircle, CreditCard, Plus, BookOpen } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  count?: number;
  urgent?: boolean;
}

interface QuickActionsDashboardProps {
  onActionClick: (actionId: string) => void;
}

export const QuickActionsDashboard = ({ onActionClick }: QuickActionsDashboardProps) => {
  const quickActions: QuickAction[] = [
    {
      id: 'book-consultation',
      title: 'Book Consultation',
      description: 'Schedule expert advice',
      icon: Calendar,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10'
    },
    {
      id: 'upload-documents',
      title: 'Upload Documents',
      description: 'Add required files',
      icon: FileText,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      count: 3,
      urgent: true
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get instant help',
      icon: MessageCircle,
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10'
    },
    {
      id: 'view-invoices',
      title: 'View Invoices',
      description: 'Check payments',
      icon: CreditCard,
      color: 'text-brand-purple',
      bgColor: 'bg-brand-purple/10'
    },
    {
      id: 'start-new-service',
      title: 'Start New Service',
      description: 'Begin application',
      icon: Plus,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'browse-resources',
      title: 'Browse Resources',
      description: 'Learning materials',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Card 
            key={action.id} 
            className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onActionClick(action.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center relative group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  {action.count && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-orange text-white text-xs rounded-full flex items-center justify-center">
                      {action.count}
                    </div>
                  )}
                  {action.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};