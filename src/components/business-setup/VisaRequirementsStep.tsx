import React from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "@/types/businessSetup";

const VisaRequirementsStep: React.FC<StepProps> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Visa Requirements</h2>
        <p className="text-muted-foreground">How many visas do you need for your company?</p>
      </div>
      
      <div className="space-y-4">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Investor Visas</label>
              <Select 
                value={state.investorVisas.toString()} 
                onValueChange={(value) => setState({ investorVisas: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select investor visas" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(6)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? 'Investor Visa' : 'Investor Visas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Employee Visas</label>
              <Select 
                value={state.employeeVisas.toString()} 
                onValueChange={(value) => setState({ employeeVisas: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee visas" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? 'Employee Visa' : 'Employee Visas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Select 0 if you don't need any visas initially
      </div>
    </div>
  );
};

export default VisaRequirementsStep;