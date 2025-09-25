import React from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Clock, DollarSign } from "lucide-react";
import { StepProps } from "@/types/businessSetup";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

const VisaSelectionStep: React.FC<StepProps> = ({ state, setState }) => {
  const { visaTypes } = useGoogleSheetsData();

  const handleVisaCountChange = (count: number) => {
    setState({ totalVisas: Math.max(0, Math.min(10, count)) });
  };

  const handleVisaTypeChange = (index: number, visaTypeId: string) => {
    const selectedVisa = visaTypes.find(visa => visa.id === visaTypeId);
    if (!selectedVisa) return;

    const newVisaTypes = [...(state.selectedVisaTypes || [])];
    newVisaTypes[index] = selectedVisa;
    
    setState({ selectedVisaTypes: newVisaTypes });
  };

  const getTotalVisaCost = () => {
    if (!state.selectedVisaTypes) return 0;
    return state.selectedVisaTypes.reduce((total, visa) => total + (visa?.price || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Visa Requirements</h2>
        <p className="text-muted-foreground">
          Select the number and types of visas you need (At least 1 visa required if not UAE resident)
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Visa Count Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Number of Visas</label>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleVisaCountChange(state.totalVisas - 1)}
                disabled={state.totalVisas <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{state.totalVisas}</div>
                <div className="text-sm text-muted-foreground">
                  {state.totalVisas === 1 ? 'Visa' : 'Visas'}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleVisaCountChange(state.totalVisas + 1)}
                disabled={state.totalVisas >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Maximum 10 visas allowed
            </p>
          </div>

          {/* Visa Type Selection */}
          {state.totalVisas > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Select Visa Types</label>
              <div className="space-y-3">
                {Array.from({ length: state.totalVisas }, (_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-muted-foreground w-16">
                      Visa {index + 1}:
                    </span>
                    <Select
                      value={state.selectedVisaTypes?.[index]?.id || ""}
                      onValueChange={(value) => handleVisaTypeChange(index, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select visa type" />
                      </SelectTrigger>
                      <SelectContent>
                        {visaTypes.map((visa) => (
                          <SelectItem key={visa.id} value={visa.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{visa.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                AED {visa.price.toLocaleString()}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Visa Types Information */}
      {visaTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visaTypes.map((visa) => (
            <Card key={visa.id} className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{visa.name}</h3>
                <p className="text-sm text-muted-foreground">{visa.description}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    <span>AED {visa.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{visa.processingTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cost Summary */}
      {state.totalVisas > 0 && state.selectedVisaTypes && state.selectedVisaTypes.length > 0 && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
            ✓ Visa Selection Summary
          </h3>
          <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
            <p>Total Visas: {state.totalVisas}</p>
            <p>Estimated Visa Costs: AED {getTotalVisaCost().toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* UAE Resident Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Important Note</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• If you're a UAE resident, you may not need additional visas</li>
          <li>• Non-UAE residents must have at least one visa to operate</li>
          <li>• Investor visas are recommended for business owners</li>
          <li>• Employee visas are required for staff members</li>
        </ul>
      </div>
    </div>
  );
};

export default VisaSelectionStep;