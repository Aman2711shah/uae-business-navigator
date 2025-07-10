import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, DollarSign, Save, Send, Upload, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";

const applicationSteps = {
  "company-formation": {
    title: "Company Formation Application",
    steps: [
      {
        title: "Select Business Activity",
        field: "businessActivity",
        type: "select",
        options: ["Trading", "Consulting", "IT Services", "Healthcare", "Real Estate", "Manufacturing", "Other"]
      },
      {
        title: "Legal Entity Type",
        field: "entityType",
        type: "select",
        options: ["LLC", "Branch Office", "Representative Office", "Free Zone Company"]
      },
      {
        title: "Number of Shareholders",
        field: "shareholders",
        type: "number",
        min: 1,
        max: 5
      },
      {
        title: "Number of Visas Required",
        field: "visas",
        type: "number",
        min: 0,
        max: 10
      }
    ]
  },
  "licensing-services": {
    title: "Licensing Services Application",
    steps: [
      {
        title: "License Type",
        field: "licenseType",
        type: "select",
        options: ["Trade License", "Professional License", "Industrial License", "Tourism License"]
      },
      {
        title: "Validity Period",
        field: "validityPeriod",
        type: "select",
        options: ["1 Year", "2 Years", "3 Years"]
      },
      {
        title: "Renewal Status",
        field: "renewalStatus",
        type: "select",
        options: ["New License", "Renewal", "Amendment"]
      },
      {
        title: "Business Activity",
        field: "businessActivity",
        type: "textarea",
        placeholder: "Describe your business activities..."
      }
    ]
  },
  "visa-immigration": {
    title: "Visa & Immigration Application",
    steps: [
      {
        title: "Visa Type",
        field: "visaType",
        type: "select",
        options: ["Investor Visa", "Employment Visa", "Family Visa", "Golden Visa", "Visit Visa"]
      },
      {
        title: "Number of Applicants",
        field: "applicants",
        type: "number",
        min: 1,
        max: 10
      },
      {
        title: "Nationality",
        field: "nationality",
        type: "text",
        placeholder: "Enter nationality"
      },
      {
        title: "Duration",
        field: "duration",
        type: "select",
        options: ["30 Days", "90 Days", "1 Year", "2 Years", "3 Years", "5 Years", "10 Years"]
      }
    ]
  },
  "legal-compliance": {
    title: "Legal & Compliance Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Legal Consultation", "Contract Drafting", "Compliance Review", "Dispute Resolution", "Corporate Governance"]
      },
      {
        title: "Urgency Level",
        field: "urgencyLevel",
        type: "select",
        options: ["Standard", "Urgent", "Emergency"]
      },
      {
        title: "Company Size",
        field: "companySize",
        type: "select",
        options: ["Small (1-10 employees)", "Medium (11-50 employees)", "Large (50+ employees)"]
      },
      {
        title: "Description",
        field: "description",
        type: "textarea",
        placeholder: "Describe your legal requirements..."
      }
    ]
  },
  "tax-accounting": {
    title: "Tax & Accounting Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["VAT Registration", "Corporate Tax", "Bookkeeping", "Audit Services", "Tax Consultation"]
      },
      {
        title: "Accounting Period",
        field: "accountingPeriod",
        type: "select",
        options: ["Monthly", "Quarterly", "Annually"]
      },
      {
        title: "Company Turnover",
        field: "turnover",
        type: "select",
        options: ["Below AED 375,000", "AED 375,000 - 1,875,000", "Above AED 1,875,000"]
      },
      {
        title: "Previous Tax Registration",
        field: "previousRegistration",
        type: "select",
        options: ["Yes", "No"]
      }
    ]
  },
  "office-solutions": {
    title: "Office Solutions Application",
    steps: [
      {
        title: "Office Type",
        field: "officeType",
        type: "select",
        options: ["Physical Office", "Virtual Office", "Co-working Space", "Meeting Rooms"]
      },
      {
        title: "Number of Seats",
        field: "seats",
        type: "number",
        min: 1,
        max: 50
      },
      {
        title: "Duration",
        field: "duration",
        type: "select",
        options: ["Monthly", "3 Months", "6 Months", "1 Year", "2 Years"]
      },
      {
        title: "Location Preference",
        field: "location",
        type: "text",
        placeholder: "Preferred location in UAE"
      }
    ]
  },
  "pro-services": {
    title: "PRO Services Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Government Liaison", "Ministry Approvals", "Municipality Services", "Immigration Services", "Document Clearing"]
      },
      {
        title: "Document Type",
        field: "documentType",
        type: "select",
        options: ["Visa Processing", "License Renewal", "Attestation", "Translation", "Other"]
      },
      {
        title: "Urgency",
        field: "urgency",
        type: "select",
        options: ["Standard", "Urgent", "Same Day"]
      },
      {
        title: "Special Requirements",
        field: "requirements",
        type: "textarea",
        placeholder: "Any special requirements or instructions..."
      }
    ]
  },
  "bank-account-opening": {
    title: "Bank Account Opening Application",
    steps: [
      {
        title: "Account Type",
        field: "accountType",
        type: "select",
        options: ["Corporate Account", "Personal Account", "Investment Account", "Multi-Currency Account"]
      },
      {
        title: "Preferred Bank",
        field: "bank",
        type: "select",
        options: ["ADCB", "Emirates NBD", "FAB", "HSBC", "Standard Chartered", "CBD", "Other"]
      },
      {
        title: "Initial Deposit",
        field: "initialDeposit",
        type: "select",
        options: ["AED 10,000 - 50,000", "AED 50,000 - 100,000", "AED 100,000 - 500,000", "Above AED 500,000"]
      },
      {
        title: "Nationality",
        field: "nationality",
        type: "text",
        placeholder: "Account holder nationality"
      }
    ]
  }
};

const ApplicationProcess = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showCosts, setShowCosts] = useState(false);
  
  const { calculateFreezoneTotal, isLoading: costsLoading } = useBusinessCosts();
  
  const costData = categoryId === "company-formation" ? calculateFreezoneTotal(
    [formData.businessActivity || "Trading"],
    formData.entityType?.toLowerCase().replace(/\s+/g, "_") || "llc",
    parseInt(formData.shareholders) || 1,
    parseInt(formData.visas) || 0,
    "Dubai Multi Commodities Centre (DMCC)"
  ) : null;

  const applicationData = categoryId ? applicationSteps[categoryId as keyof typeof applicationSteps] : null;

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < applicationData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCosts(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderFormField = (step: any) => {
    const { field, type, options, min, max, placeholder } = step;
    const value = formData[field] || "";

    switch (type) {
      case "select":
        return (
          <Select value={value} onValueChange={(value) => handleInputChange(field, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${step.title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Enter ${step.title.toLowerCase()}`}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
          />
        );
    }
  };

  if (showCosts && categoryId === "company-formation") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setShowCosts(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cost Estimate</h1>
              <p className="text-muted-foreground">Review your estimated costs</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {costsLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Calculating costs...</p>
              </CardContent>
            </Card>
          )}

          {costData?.totalCost > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-semibold">Total Estimated Cost</span>
                      <span className="text-2xl font-bold text-primary">AED {costData?.totalCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {costData?.breakdown && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="font-medium">License Fee</span>
                            <span className="font-semibold">AED {costData.breakdown.totalLicenseFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="font-medium">Shareholder Fee ({costData.breakdown.shareholders} additional)</span>
                            <span className="font-semibold">AED {costData.breakdown.shareholderFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="font-medium">Visa Processing ({costData.breakdown.visaCount} visas)</span>
                            <span className="font-semibold">AED {costData.breakdown.visaFee.toLocaleString()}</span>
                          </div>
                          {costData.breakdown.freezoneName && (
                            <div className="p-2 bg-muted/30 rounded text-sm">
                              <span className="text-muted-foreground">Freezone: {costData.breakdown.freezoneName}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button size="lg" variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Quote for Later
                </Button>
                <Button size="lg" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/service-category/${categoryId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{applicationData.title}</h1>
            <p className="text-muted-foreground">Step {currentStep + 1} of {applicationData.steps.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / applicationData.steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {applicationData.steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor={applicationData.steps[currentStep].field}>
              {applicationData.steps[currentStep].title}
            </Label>
            {renderFormField(applicationData.steps[currentStep])}
          </CardContent>
        </Card>

        {/* Summary of filled data */}
        {Object.keys(formData).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(formData).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant="secondary" className="w-fit">
                        {value}
                      </Badge>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1">
              Previous
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="flex-1"
            disabled={!formData[applicationData.steps[currentStep].field]}
          >
            {currentStep === applicationData.steps.length - 1 ? "Get Quote" : "Next"}
          </Button>
        </div>

        {/* Upload Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Upload Documents (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can upload documents now or later in the process
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ApplicationProcess;