import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Building2, Users, Plane, FileText, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const businessActivities = {
  "Trading": [
    "General Trading", "Import/Export", "Wholesale Trading", "Retail Trading", 
    "E-commerce Trading", "Food Trading", "Electronics Trading", "Textile Trading"
  ],
  "Services": [
    "Consulting Services", "IT Services", "Marketing Services", "Legal Services",
    "Accounting Services", "HR Services", "Real Estate Services", "Tourism Services"
  ],
  "Manufacturing": [
    "Food Manufacturing", "Textile Manufacturing", "Electronics Manufacturing",
    "Chemical Manufacturing", "Plastic Manufacturing", "Metal Manufacturing"
  ],
  "Construction": [
    "General Construction", "Civil Engineering", "Interior Design", "Architecture",
    "Project Management", "MEP Services"
  ],
  "Healthcare": [
    "Medical Services", "Dental Services", "Pharmacy", "Medical Equipment",
    "Health Consulting", "Wellness Services"
  ],
  "Education": [
    "Training Services", "Educational Consulting", "Language Training",
    "Professional Development", "Online Education"
  ]
};

const legalEntityTypes = [
  { value: "sole", label: "Sole Establishment", description: "Single owner business" },
  { value: "llc", label: "Limited Liability Company (LLC)", description: "Multiple shareholders" },
  { value: "fzc", label: "Free Zone Company (FZC/FZE)", description: "Free zone establishment" },
  { value: "branch", label: "Branch Office", description: "Extension of foreign company" },
  { value: "offshore", label: "Offshore Company", description: "International business" }
];

const BusinessSetupFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [shareholders, setShareholders] = useState<number>(1);
  const [visas, setVisas] = useState<number>(1);
  const [entityType, setEntityType] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [costBreakdown, setCostBreakdown] = useState<any>(null);
  const [isFreezone, setIsFreezone] = useState<boolean>(false);
  
  const { getActivityCosts, getEntityCost, getShareholderFee, getVisaFee, isLoading, calculateFreezoneTotal, getFreezoneOptions } = useBusinessCosts();

  const steps = [
    { number: 1, title: "Business Activities", icon: Building2 },
    { number: 2, title: "Shareholders", icon: Users },
    { number: 3, title: "Visa Requirements", icon: Plane },
    { number: 4, title: "Legal Entity", icon: FileText },
    { number: 5, title: "Cost Estimation", icon: Calculator }
  ];

  const handleActivityToggle = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const calculateCost = () => {
    // Determine if it's a freezone entity
    const isFreezoneBusiness = entityType === "fzc" || entityType === "branch";
    setIsFreezone(isFreezoneBusiness);
    
    if (isFreezoneBusiness) {
      // Use new freezone cost calculation
      const { totalCost, breakdown } = calculateFreezoneTotal(
        selectedActivities, 
        entityType, 
        shareholders, 
        visas
      );
      
      setEstimatedCost(totalCost);
      setCostBreakdown(breakdown);
    } else {
      // Use legacy mainland cost calculation
      const activityCosts = getActivityCosts(selectedActivities, false);
      const totalLicenseFee = activityCosts.reduce((sum, item) => sum + item.fee, 0);
      
      const legalEntityFee = getEntityCost(entityType, false);
      const shareholderFee = getShareholderFee() * Math.max(0, shareholders - 1);
      const visaFee = getVisaFee() * visas;
      
      const totalCost = totalLicenseFee + legalEntityFee + shareholderFee + visaFee;
      
      const breakdown = {
        activities: activityCosts,
        totalLicenseFee,
        legalEntityFee,
        shareholderFee,
        visaFee,
        shareholders: shareholders - 1,
        visaCount: visas,
        entityType: legalEntityTypes.find(e => e.value === entityType)?.label || entityType,
        isFreezone: false
      };
      
      setCostBreakdown(breakdown);
      setEstimatedCost(totalCost);
    }
  };

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (selectedActivities.length > 0 && entityType && currentStep === 5) {
      calculateCost();
    }
  }, [selectedActivities, shareholders, visas, entityType, currentStep]);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 4) {
        calculateCost();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedActivities.length > 0;
      case 2: return shareholders > 0;
      case 3: return visas > 0;
      case 4: return entityType !== "";
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Business Activities</h2>
              <p className="text-muted-foreground">Choose up to 3 business activities for your company</p>
            </div>
            
            {Object.entries(businessActivities).map(([category, activities]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {activities.map((activity) => (
                    <Button
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => handleActivityToggle(activity)}
                      disabled={!selectedActivities.includes(activity) && selectedActivities.length >= 3}
                    >
                      {activity}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            
            {selectedActivities.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-foreground mb-2">Selected Activities:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedActivities.map((activity) => (
                    <Badge key={activity} variant="default" className="px-3 py-1">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
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
                  onClick={() => setShareholders(Math.max(1, shareholders - 1))}
                  disabled={shareholders <= 1}
                >
                  -
                </Button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{shareholders}</div>
                  <div className="text-sm text-muted-foreground">Shareholders</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShareholders(Math.min(5, shareholders + 1))}
                  disabled={shareholders >= 5}
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Visa Requirements</h2>
              <p className="text-muted-foreground">How many visas do you need for your company?</p>
            </div>
            
            <Card className="p-6">
              <div className="space-y-4">
                <Select value={visas.toString()} onValueChange={(value) => setVisas(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of visas" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(20)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i + 1 === 1 ? 'Visa' : 'Visas'}
                      </SelectItem>
                    ))}
                    <SelectItem value="unlimited">Unlimited Visas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        );

      case 4:
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
                    entityType === entity.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                  }`}
                  onClick={() => setEntityType(entity.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{entity.label}</h3>
                        <p className="text-sm text-muted-foreground">{entity.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        entityType === entity.value ? 'bg-primary border-primary' : 'border-muted-foreground'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation</h2>
              <p className="text-muted-foreground">Based on your selections, here's the estimated cost</p>
            </div>
            
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  AED {estimatedCost.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated Setup Cost {isFreezone ? "(Free Zone)" : "(Mainland)"}
                </div>
              </div>
            </Card>

            {costBreakdown && (
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
                    {costBreakdown.activities.map((activity: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{activity.activity}</TableCell>
                        <TableCell className="text-right">{activity.fee.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Legal Entity ({costBreakdown.entityType})</TableCell>
                      <TableCell className="text-right">{costBreakdown.legalEntityFee.toLocaleString()}</TableCell>
                    </TableRow>
                    {costBreakdown.shareholders > 0 && (
                      <TableRow>
                        <TableCell>Additional Shareholders ({costBreakdown.shareholders})</TableCell>
                        <TableCell className="text-right">{costBreakdown.shareholderFee.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Employment Visas ({costBreakdown.visaCount})</TableCell>
                      <TableCell className="text-right">{costBreakdown.visaFee.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">Total Cost</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        AED {estimatedCost.toLocaleString()}
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
                  <span className="text-foreground">{selectedActivities.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shareholders:</span>
                  <span className="text-foreground">{shareholders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visas Required:</span>
                  <span className="text-foreground">{visas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entity Type:</span>
                  <span className="text-foreground">
                    {legalEntityTypes.find(e => e.value === entityType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone Type:</span>
                  <span className="text-foreground">{isFreezone ? "Free Zone" : "Mainland"}</span>
                </div>
                {costBreakdown?.freezoneName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free Zone:</span>
                    <span className="text-foreground">{costBreakdown.freezoneName}</span>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Proceed with Application
              </Button>
              <Button variant="outline" className="w-full">
                Get Detailed Quote
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Company Setup</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center space-y-1 ${
                step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.number <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < 5 ? (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              className="flex-1"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/")} className="flex-1">
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessSetupFlow;