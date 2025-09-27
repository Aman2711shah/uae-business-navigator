import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { legalEntityTypes } from "@/data/businessSetupData";
import { StepProps } from "@/types/businessSetup";
import SmartRecommender from "./SmartRecommender";
import TimelineEstimation from "./TimelineEstimation";

const CostEstimationStep: React.FC<StepProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      {/* Smart Recommender */}
      {state.recommendedPackage && (
        <SmartRecommender
          recommendedPackage={state.recommendedPackage}
          alternativePackages={state.alternativePackages}
          estimatedCost={state.estimatedCost}
        />
      )}

      {/* Timeline Estimation */}
      <TimelineEstimation
        entityType={state.entityType}
        freezoneName={state.costBreakdown?.freezoneName}
        isFreezone={state.isFreezone}
      />

      {/* Legacy Cost Display for non-package results */}
      {!state.recommendedPackage && (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">💰 Cost Estimation</h2>
            <p className="text-muted-foreground">Detailed breakdown of your business setup costs</p>
          </div>

      {/* Legacy breakdown for mainland */}
      {state.costBreakdown && !state.isFreezone && state.costBreakdown.activities && (
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
        </>
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
            <span className="text-muted-foreground">Total Visas:</span>
            <span className="text-foreground">{state.totalVisas}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tenure:</span>
            <span className="text-foreground">{state.tenure} Year{state.tenure > 1 ? 's' : ''}</span>
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