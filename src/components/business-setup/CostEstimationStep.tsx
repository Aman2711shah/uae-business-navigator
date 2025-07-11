import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { legalEntityTypes } from "@/data/businessSetupData";
import { StepProps } from "@/types/businessSetup";

const CostEstimationStep: React.FC<StepProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">🤖 AI Cost Estimation</h2>
        <p className="text-muted-foreground">AI-powered analysis of freezone packages matching your needs</p>
      </div>
      
      {/* Recommended Package */}
      {state.recommendedPackage && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">✨ Recommended Package</h3>
            <Badge variant="secondary" className="bg-green-200 text-green-800">Best Value</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-xl text-green-900">{state.recommendedPackage.package_name}</h4>
              <p className="text-green-700 font-medium">{state.recommendedPackage.freezone_name}</p>
              <p className="text-sm text-green-600 mt-2">{state.recommendedPackage.included_services}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">
                AED {state.estimatedCost.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">
                {state.tenure} Year{state.tenure > 1 ? 's' : ''} | {state.totalVisas} Visa{state.totalVisas !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Alternative Packages */}
      {state.alternativePackages && state.alternativePackages.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">📋 Alternative Options</h3>
          {state.alternativePackages.map((pkg: any, index: number) => (
            <Card key={index} className="p-4 border-2 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">{pkg.package_name}</h4>
                  <p className="text-sm text-muted-foreground">{pkg.freezone_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    AED {pkg.calculatedCost.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{((pkg.calculatedCost - state.estimatedCost) / state.estimatedCost * 100).toFixed(0)}% more
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cost Breakdown for Freezone */}
      {state.costBreakdown && state.isFreezone && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">💰 Cost Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Cost (AED)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Base Package ({state.costBreakdown.packageName})</TableCell>
                <TableCell className="text-right">{state.costBreakdown.baseCost.toLocaleString()}</TableCell>
              </TableRow>
              {state.totalVisas > 0 && (
                <TableRow>
                  <TableCell>Visa Costs ({state.totalVisas} visas)</TableCell>
                  <TableCell className="text-right">{state.costBreakdown.visaCost.toLocaleString()}</TableCell>
                </TableRow>
              )}
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