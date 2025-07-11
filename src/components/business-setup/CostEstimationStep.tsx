import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { legalEntityTypes } from "@/data/businessSetupData";
import { StepProps } from "@/types/businessSetup";

const CostEstimationStep: React.FC<StepProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation</h2>
        <p className="text-muted-foreground">Based on your selections, here's the estimated cost</p>
      </div>
      
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            AED {state.estimatedCost.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Estimated Setup Cost {state.isFreezone ? "(Free Zone)" : "(Mainland)"}
          </div>
        </div>
      </Card>

      {state.costBreakdown && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Detailed Cost Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Cost (AED)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.costBreakdown.activities.map((activity: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{activity.activity}</TableCell>
                  <TableCell className="text-right">{activity.fee.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">Legal Entity ({state.costBreakdown.entityType})</TableCell>
                <TableCell className="text-right">{state.costBreakdown.legalEntityFee.toLocaleString()}</TableCell>
              </TableRow>
              {state.costBreakdown.shareholders > 0 && (
                <TableRow>
                  <TableCell>Additional Shareholders ({state.costBreakdown.shareholders})</TableCell>
                  <TableCell className="text-right">{state.costBreakdown.shareholderFee.toLocaleString()}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Employment Visas ({state.costBreakdown.visaCount})</TableCell>
                <TableCell className="text-right">{state.costBreakdown.visaFee.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total Cost</TableCell>
                <TableCell className="text-right font-bold text-primary">
                  AED {state.estimatedCost.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      )}
      
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Your Selection Summary:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Business Activities:</span>
            <span className="text-foreground">{state.selectedActivities.join(", ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shareholders:</span>
            <span className="text-foreground">{state.shareholders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Investor Visas:</span>
            <span className="text-foreground">{state.investorVisas}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Employee Visas:</span>
            <span className="text-foreground">{state.employeeVisas}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entity Type:</span>
            <span className="text-foreground">
              {legalEntityTypes.find(e => e.value === state.entityType)?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Zone Type:</span>
            <span className="text-foreground">{state.isFreezone ? "Free Zone" : "Mainland"}</span>
          </div>
          {state.costBreakdown?.freezoneName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Zone:</span>
              <span className="text-foreground">{state.costBreakdown.freezoneName}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CostEstimationStep;