import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceOverviewProps {
  category: ServiceCategory;
}

const ServiceOverview = ({ category }: ServiceOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{category.overview}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceOverview;