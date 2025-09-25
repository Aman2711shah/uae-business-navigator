import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, DollarSign } from "lucide-react";
import { StepProps } from "@/types/businessSetup";

const ServicesSelectionStep: React.FC<StepProps> = ({ state, setState }) => {
  const handleServiceToggle = (serviceId: string) => {
    const currentServices = state.selectedServices || [];
    const isSelected = currentServices.includes(serviceId);
    
    if (isSelected) {
      setState({
        selectedServices: currentServices.filter(id => id !== serviceId)
      });
    } else if (currentServices.length < 10) {
      setState({
        selectedServices: [...currentServices, serviceId]
      });
    }
  };

  const selectedCount = state.selectedServices?.length || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Services</h2>
        <p className="text-muted-foreground">Choose up to 10 services for your business (Selected: {selectedCount}/10)</p>
      </div>

      {!state.availableServices || state.availableServices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a business category first</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.availableServices.map((service) => {
            const isSelected = state.selectedServices?.includes(service.id) || false;
            const canSelect = selectedCount < 10 || isSelected;
            
            return (
              <Card
                key={service.id}
                className={`p-6 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : canSelect
                    ? 'border-border hover:border-primary/50 cursor-pointer'
                    : 'border-border opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canSelect && handleServiceToggle(service.id)}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={isSelected}
                    disabled={!canSelect}
                    className="mt-1"
                    onCheckedChange={() => canSelect && handleServiceToggle(service.id)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        
                        {service.isRequired && (
                          <Badge variant="destructive" className="mt-2 text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>AED {service.standardPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{service.timeline}</span>
                        </div>
                      </div>
                    </div>
                    
                    {service.documentRequirements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Required Documents:</p>
                            <p className="text-xs text-muted-foreground">
                              {service.documentRequirements.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            ✓ {selectedCount} Service{selectedCount !== 1 ? 's' : ''} Selected
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {selectedCount < 10 
              ? `You can select ${10 - selectedCount} more service${10 - selectedCount !== 1 ? 's' : ''}.`
              : 'Maximum services selected. You can deselect services to choose different ones.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesSelectionStep;