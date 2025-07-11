import { ArrowLeft, Calendar, MapPin, Users, DollarSign, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BusinessServicesAssistantProps {
  selectedSection: "Success Stories" | "Upcoming Workshops";
  selectedItemName: string;
  industry?: string;
  highlight: string;
  description: string;
  dateTime?: string;
  location?: string;
  spotsLeft?: number;
  price?: number;
  onBack: () => void;
  onAction: () => void;
}

const BusinessServicesAssistant = ({
  selectedSection,
  selectedItemName,
  industry,
  highlight,
  description,
  dateTime,
  location,
  spotsLeft,
  price,
  onBack,
  onAction
}: BusinessServicesAssistantProps) => {
  const isSuccessStory = selectedSection === "Success Stories";
  const isWorkshop = selectedSection === "Upcoming Workshops";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">
          {selectedSection}
        </h1>
      </div>

      {/* Content Card */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          {isSuccessStory && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedItemName}</h2>
                  {industry && (
                    <Badge variant="secondary" className="mt-1">
                      {industry}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-600">{highlight}</span>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>

              <Button 
                onClick={onAction}
                className="w-full"
                variant="orange"
              >
                Learn More
              </Button>
            </>
          )}

          {isWorkshop && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{selectedItemName}</h2>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {dateTime && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{dateTime}</span>
                  </div>
                )}

                {location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{location}</span>
                  </div>
                )}

                {spotsLeft && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{spotsLeft} spots left</span>
                  </div>
                )}

                {price && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-brand-orange">AED {price}</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>

              <Button 
                onClick={onAction}
                className="w-full"
                variant="orange"
              >
                Register Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to Growth
        </Button>
      </div>
    </div>
  );
};

export default BusinessServicesAssistant;