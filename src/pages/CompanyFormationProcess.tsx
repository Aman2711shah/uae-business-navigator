import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calculator, FileText, Users, Briefcase, MapPin, Save, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const businessActivities = [
  "General Trading",
  "Import & Export",
  "Consulting Services",
  "Information Technology",
  "Real Estate",
  "Construction",
  "Manufacturing",
  "Healthcare Services",
  "Educational Services",
  "Food & Beverage",
  "Tourism & Hospitality",
  "Financial Services",
  "Media & Entertainment",
  "Logistics & Transportation"
];

const CompanyFormationProcess = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { 
    getFreezoneOptions, 
    calculateFreezoneTotal, 
    getActivityCosts, 
    getEntityCost, 
    getShareholderFee, 
    getVisaFee,
    isLoading 
  } = useBusinessCosts();

  const serviceData = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    selectedActivities: [] as string[],
    numberOfShareholders: 1,
    numberOfVisas: 0,
    entityType: "",
    jurisdiction: "",
    selectedFreezone: "",
    contactInfo: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const [costCalculation, setCostCalculation] = useState({
    totalCost: 0,
    breakdown: null as any
  });

  const steps = [
    { number: 1, title: "Business Details", icon: Briefcase },
    { number: 2, title: "Structure & Visas", icon: Users },
    { number: 3, title: "Jurisdiction & Entity", icon: MapPin },
    { number: 4, title: "Cost Estimation", icon: Calculator },
    { number: 5, title: "Contact Information", icon: FileText }
  ];

  useEffect(() => {
    if (formData.selectedActivities.length > 0 && formData.entityType && formData.jurisdiction) {
      calculateCosts();
    }
  }, [formData.selectedActivities, formData.entityType, formData.jurisdiction, formData.numberOfShareholders, formData.numberOfVisas, formData.selectedFreezone]);

  const calculateCosts = () => {
    if (formData.jurisdiction === "Free Zone" && formData.entityType) {
      const result = calculateFreezoneTotal(
        formData.selectedActivities,
        formData.entityType,
        formData.numberOfShareholders,
        formData.numberOfVisas,
        formData.selectedFreezone
      );
      setCostCalculation(result);
    } else {
      // Mainland calculation (legacy)
      const activityCosts = getActivityCosts(formData.selectedActivities, false);
      const entityCost = getEntityCost(formData.entityType, false);
      const shareholderFee = getShareholderFee() * Math.max(0, formData.numberOfShareholders - 1);
      const visaFee = getVisaFee() * formData.numberOfVisas;
      
      const totalLicenseFee = activityCosts.reduce((sum, item) => sum + item.fee, 0);
      const totalCost = totalLicenseFee + entityCost + shareholderFee + visaFee;
      
      setCostCalculation({
        totalCost,
        breakdown: {
          activities: activityCosts,
          totalLicenseFee,
          legalEntityFee: entityCost,
          shareholderFee,
          visaFee,
          shareholders: formData.numberOfShareholders - 1,
          visaCount: formData.numberOfVisas,
          entityType: formData.entityType,
          isFreezone: false
        }
      });
    }
  };

  const handleActivityChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter(a => a !== activity)
        : [...prev.selectedActivities, activity]
    }));
  };

  const getFreezoneOptionsForForm = () => {
    if (formData.jurisdiction === "Free Zone" && formData.selectedActivities.length > 0 && formData.entityType) {
      return getFreezoneOptions(formData.selectedActivities, formData.entityType);
    }
    return [];
  };

  const handleSaveQuote = () => {
    // Save quote logic
    toast({
      title: "Quote Saved",
      description: "Your quote has been saved successfully. You can access it later from your dashboard."
    });
  };

  const handleSubmitInquiry = () => {
    // Submit inquiry logic
    toast({
      title: "Inquiry Submitted",
      description: "Thank you for your inquiry. Our team will contact you within 24 hours."
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.selectedActivities.length > 0;
      case 2:
        return true;
      case 3:
        return formData.entityType && formData.jurisdiction;
      case 4:
        return true;
      case 5:
        return formData.contactInfo.name && formData.contactInfo.email && formData.contactInfo.phone;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cost calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/service/${serviceId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Company Formation</h1>
            <p className="text-muted-foreground">{serviceData.serviceTitle || "Business Setup Process"}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.number 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </p>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const IconComponent = steps[currentStep - 1].icon;
                return <IconComponent className="h-5 w-5" />;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Select Business Activities (Choose multiple)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {businessActivities.map((activity) => (
                      <div
                        key={activity}
                        onClick={() => handleActivityChange(activity)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.selectedActivities.includes(activity)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-sm font-medium">{activity}</span>
                      </div>
                    ))}
                  </div>
                  {formData.selectedActivities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">Selected activities:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedActivities.map((activity) => (
                          <Badge key={activity} variant="secondary">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Structure & Visas */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shareholders">Number of Shareholders</Label>
                  <Select 
                    value={formData.numberOfShareholders.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfShareholders: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Shareholder{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visas">Number of Visas Required</Label>
                  <Select 
                    value={formData.numberOfVisas.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfVisas: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} Visa{i !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Jurisdiction & Entity */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Jurisdiction</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {(serviceData.jurisdictions || ['Mainland', 'Free Zone']).map((jurisdiction: string) => (
                      <div
                        key={jurisdiction}
                        onClick={() => setFormData(prev => ({ ...prev, jurisdiction, selectedFreezone: '' }))}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.jurisdiction === jurisdiction
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="font-medium">{jurisdiction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.jurisdiction && (
                  <div>
                    <Label>Legal Entity Type</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {(formData.jurisdiction === "Free Zone" 
                        ? [
                            { key: "fzc", label: "Free Zone Company (FZ-LLC)", desc: "Limited liability company in free zone" },
                            { key: "branch", label: "Branch Office", desc: "Branch of existing foreign company" }
                          ]
                        : [
                            { key: "llc", label: "Limited Liability Company", desc: "Standard mainland company structure" },
                            { key: "sole", label: "Sole Establishment", desc: "Single person company" },
                            { key: "branch", label: "Branch Office", desc: "Branch of existing foreign company" }
                          ]
                      ).map((entity) => (
                        <div
                          key={entity.key}
                          onClick={() => setFormData(prev => ({ ...prev, entityType: entity.key }))}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            formData.entityType === entity.key
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="font-medium">{entity.label}</div>
                          <div className="text-sm text-muted-foreground">{entity.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.jurisdiction === "Free Zone" && formData.entityType && (
                  <div>
                    <Label>Select Free Zone</Label>
                    <Select 
                      value={formData.selectedFreezone} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, selectedFreezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a free zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFreezoneOptionsForForm().map((option) => (
                          <SelectItem key={option.name} value={option.name}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Cost Estimation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    AED {costCalculation.totalCost.toLocaleString()}
                  </h3>
                  <p className="text-muted-foreground">Estimated Total Cost</p>
                </div>

                {costCalculation.breakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="font-medium">License Fee</span>
                          <span>AED {costCalculation.breakdown.totalLicenseFee?.toLocaleString() || 0}</span>
                        </div>
                        
                        {costCalculation.breakdown.legalEntityFee > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span>Legal Entity Fee</span>
                            <span>AED {costCalculation.breakdown.legalEntityFee.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {costCalculation.breakdown.shareholderFee > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span>Additional Shareholders ({costCalculation.breakdown.shareholders})</span>
                            <span>AED {costCalculation.breakdown.shareholderFee.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {costCalculation.breakdown.visaFee > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span>Visa Fees ({costCalculation.breakdown.visaCount})</span>
                            <span>AED {costCalculation.breakdown.visaFee.toLocaleString()}</span>
                          </div>
                        )}

                        {costCalculation.breakdown.freezoneName && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">Free Zone: {costCalculation.breakdown.freezoneName}</p>
                            <p className="text-sm text-muted-foreground">Entity Type: {costCalculation.breakdown.entityType}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleSaveQuote} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Quote
                  </Button>
                  <Button onClick={nextStep} className="w-full">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Contact Information */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Enter your full name"
                    value={formData.contactInfo.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, name: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    placeholder="Enter your phone number"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button variant="outline" onClick={handleSaveQuote} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save for Later
                  </Button>
                  <Button onClick={handleSubmitInquiry} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Inquiry
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex justify-start mt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CompanyFormationProcess;