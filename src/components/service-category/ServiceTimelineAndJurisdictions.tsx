import { Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceTimelineAndJurisdictionsProps {
  category: ServiceCategory;
}

const ServiceTimelineAndJurisdictions = ({ category }: ServiceTimelineAndJurisdictionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Process Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{category.timeline}</p>
          <p className="text-sm text-muted-foreground">Typical processing time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Applicable Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {category.jurisdictions.map((jurisdiction, index) => (
              <Badge key={index} variant="secondary">
                {jurisdiction}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceTimelineAndJurisdictions;