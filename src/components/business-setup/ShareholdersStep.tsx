import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepProps } from "@/types/businessSetup";

const ShareholdersStep: React.FC<StepProps> = ({ state, setState }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Number of Shareholders</h2>
        <p className="text-muted-foreground">Select the number of shareholders for your company</p>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setState({ shareholders: Math.max(1, state.shareholders - 1) })}
            disabled={state.shareholders <= 1}
          >
            -
          </Button>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{state.shareholders}</div>
            <div className="text-sm text-muted-foreground">Shareholders</div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setState({ shareholders: Math.min(5, state.shareholders + 1) })}
            disabled={state.shareholders >= 5}
          >
            +
          </Button>
        </div>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        Maximum 5 shareholders allowed
      </div>
    </div>
  );
};

export default ShareholdersStep;