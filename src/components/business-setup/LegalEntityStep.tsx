import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { legalEntityTypes } from "@/data/businessSetupData";
import { StepProps } from "@/types/businessSetup";

const LegalEntityStep: React.FC<StepProps> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Legal Entity Type</h2>
        <p className="text-muted-foreground">Choose the legal structure for your business</p>
      </div>
      
      <div className="space-y-3">
        {legalEntityTypes.map((entity) => (
          <Card
            key={entity.value}
            className={`cursor-pointer transition-all ${
              state.entityType === entity.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
            }`}
            onClick={() => setState({ entityType: entity.value })}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{entity.label}</h3>
                  <p className="text-sm text-muted-foreground">{entity.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  state.entityType === entity.value ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LegalEntityStep;