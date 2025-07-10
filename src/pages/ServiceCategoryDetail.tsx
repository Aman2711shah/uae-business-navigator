import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, CheckCircle, ArrowRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

const serviceCategoryDetails = {
  "company-formation": {
    title: "Company Formation",
    description: "Professional business setup services across UAE",
    overview: "Establish your business in the UAE with our comprehensive company formation services. We handle all aspects of business setup from documentation to licensing, ensuring compliance with UAE regulations.",
    benefits: [
      "Expert guidance through UAE business setup",
      "Complete documentation support",
      "Fast processing and approvals",
      "Compliance with all UAE regulations",
      "Multiple jurisdiction options",
      "Ongoing business support"
    ],
    requirements: [
      "Valid passport copies of all shareholders",
      "Proof of address for all parties",
      "Business plan and activity description",
      "Bank reference letters",
      "Educational/professional certificates",
      "No Objection Certificate (if applicable)"
    ],
    timeline: "5-15 business days",
    jurisdictions: ["Mainland", "Free Zone"]
  },
  "licensing-services": {
    title: "Licensing Services",
    description: "Professional license acquisition and renewal services",
    overview: "Get the right business license for your activities in the UAE. Our experts help you navigate the licensing process, ensuring you get the appropriate permits for your business operations.",
    benefits: [
      "Expert license selection guidance",
      "Fast approval process",
      "Renewal reminders and support",
      "Multi-activity license options",
      "Amendment and modification services",
      "Compliance monitoring"
    ],
    requirements: [
      "Company registration documents",
      "Business activity details",
      "Lease agreement (for mainland)",
      "Professional qualifications (if required)",
      "Health and safety certificates",
      "Previous license documents (for renewals)"
    ],
    timeline: "3-7 business days",
    jurisdictions: ["Mainland", "Free Zone"]
  },
  "visa-immigration": {
    title: "Visa & Immigration",
    description: "Complete visa processing and immigration services",
    overview: "Handle all your UAE visa and immigration needs with our comprehensive services. From tourist visas to investor residence permits, we ensure smooth processing and compliance.",
    benefits: [
      "Multiple visa type options",
      "Fast track processing available",
      "Family visa facilitation",
      "Long-term residence solutions",
      "Renewal and extension support",
      "Immigration consulting"
    ],
    requirements: [
      "Valid passport with minimum 6 months validity",
      "Passport-sized photographs",
      "Medical fitness certificates",
      "Emirates ID application",
      "Salary certificates (for employment visas)",
      "Relationship documents (for family visas)"
    ],
    timeline: "2-10 business days",
    jurisdictions: ["UAE-wide"]
  },
  "legal-compliance": {
    title: "Legal & Compliance",
    description: "Professional legal consultation and compliance services",
    overview: "Ensure your business operates within UAE legal framework with our comprehensive legal and compliance services. From contract drafting to regulatory compliance, we've got you covered.",
    benefits: [
      "Expert legal consultation",
      "Contract drafting and review",
      "Regulatory compliance support",
      "Dispute resolution assistance",
      "Corporate governance guidance",
      "Legal documentation services"
    ],
    requirements: [
      "Business registration documents",
      "Existing contracts and agreements",
      "Financial statements",
      "Compliance history documentation",
      "Board resolutions",
      "Corporate structure documents"
    ],
    timeline: "1-5 business days",
    jurisdictions: ["UAE-wide"]
  },
  "tax-accounting": {
    title: "Tax & Accounting",
    description: "Comprehensive tax registration and accounting services",
    overview: "Stay compliant with UAE tax regulations and maintain accurate financial records with our professional tax and accounting services.",
    benefits: [
      "VAT registration and compliance",
      "Corporate tax advisory",
      "Professional bookkeeping",
      "Annual audit services",
      "Tax planning and optimization",
      "Financial reporting"
    ],
    requirements: [
      "Business license and registration",
      "Financial statements",
      "Bank statements",
      "Previous tax filings",
      "Accounting records",
      "Audit reports (if applicable)"
    ],
    timeline: "2-7 business days",
    jurisdictions: ["UAE-wide"]
  },
  "office-solutions": {
    title: "Office Solutions",
    description: "Flexible workspace and office solutions",
    overview: "Find the perfect workspace solution for your business needs. From virtual offices to dedicated spaces, we provide flexible options to suit your requirements.",
    benefits: [
      "Flexible workspace options",
      "Prime business locations",
      "Professional business address",
      "Meeting room facilities",
      "Mail handling services",
      "Scalable solutions"
    ],
    requirements: [
      "Business license copy",
      "Emirates ID copies",
      "Security deposit",
      "Tenancy preferences",
      "Duration requirements",
      "Facility specifications"
    ],
    timeline: "1-3 business days",
    jurisdictions: ["UAE-wide"]
  },
  "pro-services": {
    title: "PRO Services",
    description: "Government relations and document processing",
    overview: "Navigate UAE government procedures efficiently with our professional PRO services. We handle all your government-related documentation and approvals.",
    benefits: [
      "Government liaison services",
      "Document processing",
      "Ministry approvals",
      "Immigration services",
      "Municipality clearances",
      "Time-efficient processing"
    ],
    requirements: [
      "Original documents for processing",
      "Power of attorney",
      "Emirates ID copies",
      "Application forms",
      "Supporting documents",
      "Processing fees"
    ],
    timeline: "1-7 business days",
    jurisdictions: ["UAE-wide"]
  },
  "bank-account-opening": {
    title: "Bank Account Opening",
    description: "Business and personal banking solutions",
    overview: "Open bank accounts in the UAE with our banking facilitation services. We work with major banks to ensure smooth account opening processes.",
    benefits: [
      "Multiple bank options",
      "Corporate banking solutions",
      "Multi-currency accounts",
      "Investment account options",
      "Credit facility assistance",
      "Ongoing banking support"
    ],
    requirements: [
      "Company registration documents",
      "Business license",
      "Emirates ID",
      "Salary certificates",
      "Bank reference letters",
      "Initial deposit amount"
    ],
    timeline: "3-10 business days",
    jurisdictions: ["UAE-wide"]
  }
};

const ServiceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryId ? serviceCategoryDetails[categoryId as keyof typeof serviceCategoryDetails] : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Category Not Found</h1>
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

  const handleStartApplication = () => {
    navigate(`/application-process/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.title}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{category.overview}</p>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {category.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Key Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {category.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Timeline & Jurisdictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Process Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{category.timeline}</p>
              <p className="text-sm text-muted-foreground">Typical processing time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Applicable Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {category.jurisdictions.map((jurisdiction, index) => (
                  <Badge key={index} variant="secondary">
                    {jurisdiction}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-4">
              Start your application process and get an instant cost estimate
            </p>
            <Button size="lg" className="w-full" onClick={handleStartApplication}>
              Start Application Process
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServiceCategoryDetail;