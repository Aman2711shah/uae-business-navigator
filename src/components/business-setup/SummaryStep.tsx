import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { legalEntityTypes } from "@/data/businessSetupData";
import { StepProps } from "@/types/businessSetup";

const SummaryStep: React.FC<StepProps> = ({ state }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Summary & Next Steps</h2>
        <p className="text-muted-foreground">Review your selections and proceed with your business setup</p>
      </div>
      
      {/* Final Cost Display */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            AED {state.estimatedCost.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Estimated Setup Cost {state.isFreezone ? "(Free Zone)" : "(Mainland)"}
          </div>
        </div>
      </Card>

      {/* Detailed Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Your Business Setup Summary
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Business Activities</h4>
              <div className="flex flex-wrap gap-2">
                {state.selectedActivities.map((activity) => (
                  <Badge key={activity} variant="secondary" className="text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Shareholders</h4>
                <p className="text-2xl font-bold text-primary">{state.shareholders}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Total Visas</h4>
                <p className="text-2xl font-bold text-primary">{state.investorVisas + state.employeeVisas}</p>
                <p className="text-xs text-muted-foreground">{state.investorVisas} Investor + {state.employeeVisas} Employee</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Legal Entity Type</h4>
              <p className="text-foreground">
                {legalEntityTypes.find(e => e.value === state.entityType)?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {legalEntityTypes.find(e => e.value === state.entityType)?.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => {
            toast({
              title: "Application Started!",
              description: "Redirecting you to begin the formal application process.",
            });
            navigate("/application-process/company-formation");
          }}
        >
          Start Now - Begin Application
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          onClick={() => {
            toast({
              title: "Expert Consultation",
              description: "Our business consultants will contact you within 24 hours.",
            });
            navigate("/growth");
          }}
        >
          Consult an Expert
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Your selections have been saved to your profile for future reference
      </div>
    </div>
  );
};

export default SummaryStep;