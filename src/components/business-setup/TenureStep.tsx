import React from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "@/types/businessSetup";

const TenureStep: React.FC<StepProps> = ({ state, setState }) => {
  const tenureOptions = [
    { value: 1, label: "1 Year" },
    { value: 2, label: "2 Years" },
    { value: 3, label: "3 Years" },
    { value: 5, label: "5 Years" },
    { value: 10, label: "10 Years" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">License Tenure</h2>
        <p className="text-muted-foreground">Choose the duration for your business license</p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground mb-2 block">License Duration</label>
          <Select 
            value={state.tenure.toString()} 
            onValueChange={(value) => setState({ tenure: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tenure duration" />
            </SelectTrigger>
            <SelectContent>
              {tenureOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tenure Benefits</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Longer tenure often provides better rates</li>
          <li>• Multi-year packages include additional services</li>
          <li>• Avoid yearly renewal hassles</li>
          <li>• Lock in current pricing</li>
        </ul>
      </div>
    </div>
  );
};

export default TenureStep;