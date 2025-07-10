import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceBenefitsProps {
  category: ServiceCategory;
}

const ServiceBenefits = ({ category }: ServiceBenefitsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Key Benefits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {category.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServiceBenefits;