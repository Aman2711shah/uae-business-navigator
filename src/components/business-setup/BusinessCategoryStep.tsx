import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, ShoppingBag, Monitor } from "lucide-react";
import { StepProps } from "@/types/businessSetup";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

const BusinessCategoryStep: React.FC<StepProps> = ({ state, setState }) => {
  const { businessCategories, isLoading } = useGoogleSheetsData();

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'consulting':
        return <Users className="w-8 h-8" />;
      case 'media':
        return <Monitor className="w-8 h-8" />;
      case 'retail':
        return <ShoppingBag className="w-8 h-8" />;
      case 'technology':
        return <Building2 className="w-8 h-8" />;
      default:
        return <Building2 className="w-8 h-8" />;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = businessCategories.find(cat => cat.id === categoryId);
    setState({
      selectedCategory: categoryId,
      availableServices: category?.services || [],
      selectedServices: [] // Reset services when category changes
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading Business Categories...</h2>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Business Category</h2>
        <p className="text-muted-foreground">Choose the category that best describes your business type</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessCategories.map((category) => (
          <Card
            key={category.id}
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              state.selectedCategory === category.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-full ${
                state.selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {getCategoryIcon(category.id)}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {category.services.length} Services Available
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {state.selectedCategory && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">✓ Category Selected</h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            You can now proceed to select specific services for your {state.selectedCategory} business.
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessCategoryStep;