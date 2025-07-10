import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCategory } from "@/data/serviceCategoryData";

interface ServiceCategoryHeaderProps {
  category: ServiceCategory;
}

const ServiceCategoryHeader = ({ category }: ServiceCategoryHeaderProps) => {
  return (
    <div className="bg-white border-b border-border p-4">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{category.title}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryHeader;