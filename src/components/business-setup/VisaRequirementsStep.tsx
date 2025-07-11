import React from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "@/types/businessSetup";

const VisaRequirementsStep: React.FC<StepProps> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Visa Requirements</h2>
        <p className="text-muted-foreground">How many total visas do you need? (Maximum 5)</p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Total Visas</label>
          <Select 
            value={state.totalVisas.toString()} 
            onValueChange={(value) => setState({ totalVisas: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select total visas" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(6)].map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i} {i === 1 ? 'Visa' : 'Visas'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">📋 Visa Information</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Visas can be for investors, partners, or employees</li>
          <li>• Each visa allows one person to live and work in the UAE</li>
          <li>• You can add more visas later if needed</li>
          <li>• Select 0 if you don't need any visas initially</li>
        </ul>
      </div>
    </div>
  );
};

export default VisaRequirementsStep;