import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceDetailAssistant from "@/components/ServiceDetailAssistant";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceAIAssistantProps {
  category: ServiceCategory;
}

const ServiceAIAssistant = ({ category }: ServiceAIAssistantProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          AI Service Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceDetailAssistant 
          inputs={{
            selectedCategory: category.title,
            selectedService: category.title,
            userBusinessType: "General Business",
            jurisdiction: "UAE-wide",
            urgencyLevel: "Standard"
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceAIAssistant;