import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceRequirementsProps {
  category: ServiceCategory;
}

const ServiceRequirements = ({ category }: ServiceRequirementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-600" />
          Key Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {category.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">{requirement}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServiceRequirements;