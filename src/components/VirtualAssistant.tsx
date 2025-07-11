import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, MessageSquare, Calendar, FileText, Bell, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface UserData {
  user_full_name: string;
  company_name: string;
  email: string;
  membership_year: string;
  active_services: number;
  completed_services: number;
  in_progress_services: number;
  bookings: number;
  language_preference: string;
}

interface VirtualAssistantProps {
  userData: UserData;
  onActionClick?: (action: string) => void;
}

export const VirtualAssistant = ({ userData, onActionClick }: VirtualAssistantProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestedActions = [
    { icon: FileText, label: "Update Profile", action: "update-profile" },
    { icon: Calendar, label: "Review Bookings", action: "review-bookings" },
    { icon: FileText, label: "View Invoices & Payments", action: "view-invoices" },
    { icon: FileText, label: "Upload Documents", action: "upload-documents" },
    { icon: Bell, label: "Manage Notifications", action: "manage-notifications" },
    { icon: Star, label: "Save Services", action: "save-services" }
  ];

  const serviceRecommendations = [
    "Business Consultancy — Based on your completed services",
    "Visa Renewal Support — Frequently used by similar companies"
  ];

  const handleActionClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">Your personalized dashboard</p>
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Always visible greeting */}
        <div className="mb-4">
          <p className="text-foreground font-medium">
            Hello {userData.user_full_name.split(' ')[0]},
          </p>
          <p className="text-sm text-muted-foreground">
            Here's your latest account summary for {userData.company_name}:
          </p>
        </div>

        {/* Service stats - always visible */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{userData.active_services}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{userData.completed_services}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{userData.in_progress_services}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{userData.bookings}</div>
            <div className="text-xs text-muted-foreground">Bookings</div>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Pending reminder */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Bell className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800">
                You have pending invoices or documents to review.
              </p>
            </div>

            {/* Suggested actions */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Suggested Next Steps:</h4>
              <div className="grid grid-cols-2 gap-2">
                {suggestedActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-2 text-xs"
                    onClick={() => handleActionClick(action.action)}
                  >
                    <action.icon className="h-3 w-3 mr-1" />
                    <span className="truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Service recommendations */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Recommended for You:</h4>
              <div className="space-y-2">
                {serviceRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support contact */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => handleActionClick('contact-support')}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Need help? Contact Support
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};