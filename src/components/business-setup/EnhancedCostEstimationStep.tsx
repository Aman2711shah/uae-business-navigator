import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "@/types/businessSetup";
import { useCustomPackages } from "@/hooks/useCustomPackages";
import { MapPin, Users, FileText, Clock, CheckCircle } from "lucide-react";

const EnhancedCostEstimationStep: React.FC<StepProps> = ({ state, setState }) => {
  const { findBestPackage, getMainlandZones, getFreezoneZones, isLoading } = useCustomPackages();

  const handleZoneTypeChange = (zoneType: 'mainland' | 'freezone') => {
    setState({ isFreezone: zoneType === 'freezone' });
    
    // Find best package for the new zone type
    const result = findBestPackage(
      state.selectedActivities,
      state.shareholders,
      state.totalVisas,
      state.tenure,
      zoneType
    );

    if (result) {
      setState({
        estimatedCost: result.totalPrice,
        recommendedPackage: result.package,
        alternativePackages: result.alternatives || []
      });
    }
  };

  const recommendedResult = findBestPackage(
    state.selectedActivities,
    state.shareholders,
    state.totalVisas,
    state.tenure,
    state.isFreezone ? 'freezone' : 'mainland'
  );

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading packages...</div>;
  }

  if (!recommendedResult) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation</h2>
          <p className="text-muted-foreground">No suitable packages found for your requirements</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please adjust your requirements or contact us for a custom solution.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { package: recommendedPackage, totalPrice, alternatives = [] } = recommendedResult;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation</h2>
        <p className="text-muted-foreground">Based on your requirements, here are our recommendations</p>
      </div>

      {/* Zone Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Setup Type</CardTitle>
          <CardDescription>Select between mainland and free zone setup</CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={state.isFreezone ? 'freezone' : 'mainland'} 
            onValueChange={(value) => handleZoneTypeChange(value as 'mainland' | 'freezone')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainland">Mainland Setup</SelectItem>
              <SelectItem value="freezone">Free Zone Setup</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Recommended Package */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Recommended Package
              </CardTitle>
              <CardDescription>Best value for your requirements</CardDescription>
            </div>
            <Badge variant="default">Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{recommendedPackage.name}</h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {recommendedPackage.zones?.name}
                </p>
                {recommendedPackage.description && (
                  <p className="text-sm text-muted-foreground mt-2">{recommendedPackage.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  AED {totalPrice.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Activities
                </div>
                <div className="font-semibold">
                  {state.selectedActivities.length} / {recommendedPackage.max_activities}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Shareholders
                </div>
                <div className="font-semibold">
                  {state.shareholders} / {recommendedPackage.max_shareholders}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Visas
                </div>
                <div className="font-semibold">
                  {state.totalVisas} / {recommendedPackage.max_visas}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Tenure
                </div>
                <div className="font-semibold">{state.tenure} Year(s)</div>
              </div>
            </div>

            {recommendedPackage.included_services && recommendedPackage.included_services.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Included Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendedPackage.included_services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alternative Packages */}
      {alternatives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Alternative Options</h3>
          
          {alternatives.map(({ package: altPackage, totalPrice: altPrice }, index) => (
            <Card key={altPackage.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{altPackage.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {altPackage.zones?.name}
                    </p>
                    {altPackage.description && (
                      <p className="text-xs text-muted-foreground mt-1">{altPackage.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">AED {altPrice.toLocaleString()}</div>
                    <Badge variant="outline">{altPackage.package_type}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Requirements Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Selected Activities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {state.selectedActivities.map((activity, index) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Shareholders:</span> {state.shareholders}
              </div>
              <div>
                <span className="font-medium">Total Visas:</span> {state.totalVisas}
              </div>
              <div>
                <span className="font-medium">Tenure:</span> {state.tenure} Year(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCostEstimationStep;