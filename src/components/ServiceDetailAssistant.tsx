import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, DollarSign, ArrowRight, Lightbulb } from "lucide-react";

interface ServiceInputs {
  selectedCategory: string;
  selectedService: string;
  userBusinessType?: string;
  jurisdiction?: string;
  urgencyLevel?: string;
}

interface ServiceInfo {
  overview: string;
  benefits: string[];
  documents: string[];
  timeline: string;
  priceRange: string;
  recommendations: Array<{
    name: string;
    reason: string;
  }>;
}

const serviceDatabase: Record<string, Record<string, ServiceInfo>> = {
  "company-formation": {
    "LLC Formation": {
      overview: "Limited Liability Company setup providing limited liability protection and flexible business operations across various sectors in UAE.",
      benefits: [
        "Limited liability protection for shareholders",
        "Flexible business structure with multiple activities",
        "Access to UAE domestic market and government contracts"
      ],
      documents: ["Passport copies", "No Objection Certificate", "Business plan", "Bank statements"],
      timeline: "7-10 working days",
      priceRange: "Starting from AED 15,000",
      recommendations: [
        { name: "Trade License Application", reason: "Required for business operations" },
        { name: "Bank Account Opening", reason: "Essential for financial transactions" }
      ]
    },
    "Free Zone Company": {
      overview: "Business setup in UAE free zones offering 100% foreign ownership, tax exemptions, and streamlined processes.",
      benefits: [
        "100% foreign ownership without local sponsor",
        "No corporate or personal income tax",
        "Full repatriation of capital and profits"
      ],
      documents: ["Passport copies", "Business plan", "Bank reference letters", "Educational certificates"],
      timeline: "5-7 working days",
      priceRange: "Starting from AED 12,000",
      recommendations: [
        { name: "Investor Visa Processing", reason: "Residency for business owners" },
        { name: "Office Solutions", reason: "Physical presence in free zone" }
      ]
    }
  },
  "visa-immigration": {
    "Investor Visa Processing": {
      overview: "Investor Visa Processing helps investors obtain residency visas for business activities in the UAE.",
      benefits: [
        "Residency status for investors and their families",
        "Access to UAE banking and utilities",
        "Simplified business operations"
      ],
      documents: ["Passport Copy", "Personal Photo", "Company Trade License", "Immigration Establishment Card"],
      timeline: "10-15 working days",
      priceRange: "Starting from AED 4,500",
      recommendations: [
        { name: "Partner Visa Processing", reason: "Visa for business partners" },
        { name: "Emirates ID Application", reason: "Required for UAE residency" }
      ]
    },
    "Employment Visa Processing": {
      overview: "Employment visa processing for employees and staff members to work legally in UAE.",
      benefits: [
        "Legal work authorization in UAE",
        "Access to healthcare and social benefits",
        "Family sponsorship eligibility"
      ],
      documents: ["Passport copy", "Educational certificates", "Medical fitness certificate", "Labour contract"],
      timeline: "7-12 working days",
      priceRange: "Starting from AED 3,200",
      recommendations: [
        { name: "Labour Card Application", reason: "Work permit requirement" },
        { name: "Family Visa Processing", reason: "Bring family to UAE" }
      ]
    }
  },
  "licensing-services": {
    "Trade License Application": {
      overview: "Professional trade license acquisition for conducting business activities in UAE mainland or free zones.",
      benefits: [
        "Legal authorization for business activities",
        "Access to UAE market and government contracts",
        "Professional credibility and compliance"
      ],
      documents: ["Business plan", "Lease agreement", "Passport copies", "NOC from sponsor"],
      timeline: "5-10 working days",
      priceRange: "Starting from AED 8,000",
      recommendations: [
        { name: "VAT Registration", reason: "Tax compliance requirement" },
        { name: "Municipality Permits", reason: "Operational approvals" }
      ]
    }
  },
  "tax-accounting": {
    "VAT Registration": {
      overview: "Value Added Tax registration and compliance services for businesses with taxable supplies above AED 375,000.",
      benefits: [
        "Legal compliance with UAE tax regulations",
        "Input tax recovery on business expenses",
        "Professional tax management and advisory"
      ],
      documents: ["Trade license", "Financial statements", "Bank statements", "Lease agreement"],
      timeline: "3-5 working days",
      priceRange: "Starting from AED 2,500",
      recommendations: [
        { name: "Corporate Tax Registration", reason: "Complete tax compliance" },
        { name: "Monthly Bookkeeping", reason: "Accurate financial records" }
      ]
    }
  },
  "legal-compliance": {
    "Contract Drafting": {
      overview: "Professional legal contract drafting and review services for business agreements and partnerships.",
      benefits: [
        "Legally binding and enforceable agreements",
        "Risk mitigation and legal protection",
        "Compliance with UAE commercial laws"
      ],
      documents: ["Business details", "Agreement terms", "Party information", "Existing contracts (if any)"],
      timeline: "3-7 working days",
      priceRange: "Starting from AED 1,500",
      recommendations: [
        { name: "Legal Consultation", reason: "Ongoing legal advisory" },
        { name: "Document Attestation", reason: "Legal document validation" }
      ]
    }
  }
};

const ServiceDetailAssistant = ({ inputs }: { inputs: ServiceInputs }) => {
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServiceInfo = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const categoryKey = inputs.selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const category = serviceDatabase[categoryKey];
        
        if (category && category[inputs.selectedService]) {
          const baseInfo = category[inputs.selectedService];
          
          // Customize based on inputs
          let customizedInfo = { ...baseInfo };
          
          // Adjust timeline based on urgency
          if (inputs.urgencyLevel === "Urgent") {
            customizedInfo.timeline = customizedInfo.timeline.replace(/(\d+)-(\d+)/, (match, min, max) => {
              const newMin = Math.max(1, parseInt(min) - 2);
              const newMax = Math.max(2, parseInt(max) - 3);
              return `${newMin}-${newMax}`;
            });
            customizedInfo.priceRange = customizedInfo.priceRange.replace(/AED ([\d,]+)/, (match, amount) => {
              const newAmount = parseInt(amount.replace(/,/g, '')) * 1.3;
              return `AED ${newAmount.toLocaleString()}`;
            });
          }
          
          // Customize recommendations based on business type
          if (inputs.userBusinessType?.toLowerCase().includes('tech')) {
            customizedInfo.recommendations = [
              { name: "Digital Marketing License", reason: "Tech business operations" },
              { name: "IT Services Permit", reason: "Technology sector compliance" }
            ];
          }
          
          setServiceInfo(customizedInfo);
        } else {
          // Fallback for unknown services
          setServiceInfo({
            overview: `${inputs.selectedService} provides professional business services to help establish and maintain your business operations in the UAE.`,
            benefits: [
              "Professional service delivery",
              "Compliance with UAE regulations",
              "Expert guidance and support"
            ],
            documents: ["Passport copy", "Business license", "Supporting documents"],
            timeline: "5-10 working days",
            priceRange: "Contact for pricing",
            recommendations: [
              { name: "Business Consultation", reason: "Expert guidance needed" },
              { name: "Document Support", reason: "Additional documentation" }
            ]
          });
        }
        
        setLoading(false);
      }, 800);
    };

    getServiceInfo();
  }, [inputs]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-muted-foreground">Analyzing your service requirements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!serviceInfo) {
    return (
      <Card className="w-full border-destructive/20">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Service information not available. Please select a valid service.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Service Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-foreground">{inputs.selectedService}</CardTitle>
              <p className="text-sm text-muted-foreground">{inputs.selectedCategory}</p>
            </div>
            <div className="flex gap-2">
              {inputs.jurisdiction && (
                <Badge variant="secondary">{inputs.jurisdiction}</Badge>
              )}
              {inputs.urgencyLevel && (
                <Badge variant={inputs.urgencyLevel === "Urgent" ? "destructive" : "default"}>
                  {inputs.urgencyLevel}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Service Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Service Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{serviceInfo.overview}</p>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Key Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {serviceInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Required Documents & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {serviceInfo.documents.map((doc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Estimated Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{serviceInfo.timeline}</p>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-foreground">Estimated Price</span>
              </div>
              <p className="text-lg font-semibold text-green-600">{serviceInfo.priceRange}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            Recommended Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceInfo.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{rec.name}</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1">
          Start Application Process
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <Button variant="outline" className="flex-1">
          Get Quote
        </Button>
      </div>
    </div>
  );
};

export default ServiceDetailAssistant;