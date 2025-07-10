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
  "company-formation-licensing": {
    title: "Company Formation & Licensing Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Trade License Application & Renewals", "Name Reservation & Initial Approvals", "Drafting & Notarization of MOA/LSA Agreements", "Chamber of Commerce Registration", "DED & Free Zone License Processes"]
      },
      {
        title: "License Type",
        field: "licenseType",
        type: "select",
        options: ["Trade License", "Professional License", "Industrial License", "Tourism License"]
      },
      {
        title: "Business Activity",
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
      }
    ]
  },
  "immigration-visa-services": {
    title: "Immigration & Visa Services Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Establishment Card Application/Renewal", "Investor/Partner Visa Processing", "Employment Visa Processing", "Family Visa (Dependent) Applications", "Visa Cancellation & Status Change", "Emirates ID Application & Renewal", "Medical Test Appointment & Follow-Up", "Labour Contract Preparation & Submission"]
      },
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
  "government-liaison-approvals": {
    title: "Government Liaison & Approvals Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Coordination with MOHRE, GDRFA, DED, MOFA", "Document Clearance with Government Departments", "Municipality Approvals & Permits", "Health Authority Licensing (DHA/DOH/MOH)"]
      },
      {
        title: "Department",
        field: "department",
        type: "select",
        options: ["MOHRE", "GDRFA", "DED", "MOFA", "Municipality", "DHA", "DOH", "MOH"]
      },
      {
        title: "Document Type",
        field: "documentType",
        type: "select",
        options: ["License", "Permit", "Approval", "Clearance", "Certificate"]
      },
      {
        title: "Urgency Level",
        field: "urgencyLevel",
        type: "select",
        options: ["Standard", "Urgent", "Emergency"]
      }
    ]
  },
  "attestation-legalization": {
    title: "Attestation & Legalization Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Attestation of Educational, Commercial & POA Documents", "MOFA Attestation", "Consulate/Embassy Legalization", "Legal Translation & Notarization Support"]
      },
      {
        title: "Document Type",
        field: "documentType",
        type: "select",
        options: ["Educational Certificate", "Commercial Document", "Power of Attorney", "Birth Certificate", "Marriage Certificate", "Other Personal Document"]
      },
      {
        title: "Country of Origin",
        field: "countryOfOrigin",
        type: "text",
        placeholder: "Enter country where document was issued"
      },
      {
        title: "Number of Documents",
        field: "numberOfDocuments",
        type: "number",
        min: 1,
        max: 20
      }
    ]
  },
  "corporate-compliance": {
    title: "Corporate Compliance Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Labour Card & WPS Setup", "Company Immigration & Labour File Opening", "GOSI Registration (if applicable)", "Renewal Reminders & Compliance Tracking", "E-Signature Card Application"]
      },
      {
        title: "Company Size",
        field: "companySize",
        type: "select",
        options: ["Small (1-10 employees)", "Medium (11-50 employees)", "Large (50+ employees)"]
      },
      {
        title: "Number of Employees",
        field: "numberOfEmployees",
        type: "number",
        min: 1,
        max: 100
      },
      {
        title: "Compliance Priority",
        field: "compliancePriority",
        type: "select",
        options: ["Labour Compliance", "Immigration Compliance", "Social Insurance", "Digital Compliance"]
      }
    ]
  },
  "accounting-bookkeeping": {
    title: "Accounting & Bookkeeping Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Monthly & Quarterly Bookkeeping", "Financial Statement Preparation", "Management Reporting", "IFRS-Compliant Accounting"]
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
        title: "Accounting Software",
        field: "accountingSoftware",
        type: "select",
        options: ["QuickBooks", "Xero", "SAP", "Oracle", "Manual", "Other"]
      }
    ]
  },
  "taxation-services": {
    title: "Taxation Services Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["VAT Registration & Deregistration", "VAT Return Filing & Compliance", "VAT Advisory & Health Checks", "Corporate Tax Registration", "CT Return Filing & Advisory", "QFZP/Exempt Status Planning", "Tax Structuring & Optimization"]
      },
      {
        title: "Tax Type",
        field: "taxType",
        type: "select",
        options: ["VAT", "Corporate Tax", "Excise Tax", "Transfer Pricing"]
      },
      {
        title: "Annual Turnover",
        field: "annualTurnover",
        type: "select",
        options: ["Below AED 375,000", "AED 375,000 - 1,875,000", "Above AED 1,875,000"]
      },
      {
        title: "Current Registration Status",
        field: "registrationStatus",
        type: "select",
        options: ["Not Registered", "Registered", "Need to Register", "Need Deregistration"]
      }
    ]
  },
  "payroll-hr-compliance": {
    title: "Payroll & HR Compliance Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Payroll Processing & Payslip Generation", "WPS Compliance & Reporting", "Employee Expense Management", "HR Policy & Leave Tracking Systems"]
      },
      {
        title: "Number of Employees",
        field: "numberOfEmployees",
        type: "number",
        min: 1,
        max: 500
      },
      {
        title: "Payroll Frequency",
        field: "payrollFrequency",
        type: "select",
        options: ["Monthly", "Bi-weekly", "Weekly"]
      },
      {
        title: "Current HR System",
        field: "currentHRSystem",
        type: "select",
        options: ["Manual", "Excel", "HR Software", "None"]
      }
    ]
  },
  "audit-assurance": {
    title: "Audit & Assurance Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["External Audit Coordination", "Internal Audit & Risk Reviews", "Statutory Compliance Reviews", "Agreed-Upon Procedures (AUP)"]
      },
      {
        title: "Audit Type",
        field: "auditType",
        type: "select",
        options: ["Financial Audit", "Compliance Audit", "Operational Audit", "IT Audit"]
      },
      {
        title: "Company Size",
        field: "companySize",
        type: "select",
        options: ["SME", "Medium Enterprise", "Large Enterprise", "Listed Company"]
      },
      {
        title: "Financial Year End",
        field: "financialYearEnd",
        type: "select",
        options: ["December", "March", "June", "September", "Other"]
      }
    ]
  },
  "regulatory-compliance-filings": {
    title: "Regulatory Compliance & Filings Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["ESR, UBO & AML Reporting", "Economic Substance Notifications & Reports", "Corporate Governance Support", "Annual License Renewal Support"]
      },
      {
        title: "Compliance Type",
        field: "complianceType",
        type: "select",
        options: ["Economic Substance Regulation", "Ultimate Beneficial Ownership", "Anti-Money Laundering", "Corporate Governance"]
      },
      {
        title: "Entity Type",
        field: "entityType",
        type: "select",
        options: ["UAE Company", "Free Zone Entity", "Branch Office", "Representative Office"]
      },
      {
        title: "Annual Revenue",
        field: "annualRevenue",
        type: "select",
        options: ["Below AED 750,000", "Above AED 750,000", "Prefer not to disclose"]
      }
    ]
  },
  "advisory-strategic-consulting": {
    title: "Advisory & Strategic Consulting Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Cross-Border Tax Advisory", "Transfer Pricing Support", "M&A Due Diligence & Valuation", "CFO & Virtual Finance Office Services"]
      },
      {
        title: "Consulting Area",
        field: "consultingArea",
        type: "select",
        options: ["Tax Planning", "Transfer Pricing", "Mergers & Acquisitions", "Financial Management", "Strategic Planning"]
      },
      {
        title: "Project Duration",
        field: "projectDuration",
        type: "select",
        options: ["1-3 months", "3-6 months", "6-12 months", "12+ months", "Ongoing"]
      },
      {
        title: "Industry Sector",
        field: "industrySector",
        type: "select",
        options: ["Technology", "Healthcare", "Real Estate", "Manufacturing", "Financial Services", "Retail", "Other"]
      }
    ]
  },
  "other-support-services": {
    title: "Other Support Services Application",
    steps: [
      {
        title: "Service Type",
        field: "serviceType",
        type: "select",
        options: ["Typing Center Services", "Courier Coordination for Documents", "Assistance with Fines, Penalties & Dispute Resolution", "Vehicle Registration & Renewal", "Tenancy Contract Registration (Ejari)", "Bank Account Opening Support", "Health Insurance Registration"]
      },
      {
        title: "Support Category",
        field: "supportCategory",
        type: "select",
        options: ["Document Services", "Transportation", "Legal Support", "Registration Services", "Insurance Services"]
      },
      {
        title: "Urgency Level",
        field: "urgencyLevel",
        type: "select",
        options: ["Standard", "Urgent", "Same Day"]
      },
      {
        title: "Additional Requirements",
        field: "additionalRequirements",
        type: "textarea",
        placeholder: "Describe any additional requirements or special instructions..."
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
  
  const costData = categoryId === "company-formation-licensing" ? calculateFreezoneTotal(
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

  if (showCosts && categoryId === "company-formation-licensing") {
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