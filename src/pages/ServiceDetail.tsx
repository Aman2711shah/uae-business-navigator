import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, FileText, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

const serviceDetails = {
  "llc-formation": {
    title: "LLC Formation",
    description: "Limited Liability Company setup in UAE",
    overview: "Establish a Limited Liability Company (LLC) in the UAE, offering limited liability protection and flexible business operations across various sectors.",
    benefits: [
      "Limited liability protection for shareholders",
      "Flexible business structure",
      "Can conduct business throughout UAE",
      "Access to local and international markets",
      "Possibility to obtain multiple business licenses"
    ],
    documents: [
      "Passport copies of shareholders and managers",
      "No Objection Certificate (NOC) from sponsors",
      "Proof of address",
      "Business plan and memorandum",
      "Bank statements",
      "Educational certificates (if required)"
    ],
    timeline: "7-10 business days",
    jurisdictions: ["Mainland"],
    entityTypes: ["llc"]
  },
  "free-zone-company": {
    title: "Free Zone Company",
    description: "Business setup in UAE free zones",
    overview: "Establish your business in one of UAE's 45+ free zones, enjoying 100% foreign ownership, tax exemptions, and streamlined business setup processes.",
    benefits: [
      "100% foreign ownership",
      "No corporate or personal income tax",
      "Full repatriation of capital and profits",
      "No currency restrictions",
      "Simplified business setup process",
      "Access to world-class infrastructure"
    ],
    documents: [
      "Passport copies of shareholders and directors",
      "Proof of address",
      "Business plan",
      "Bank reference letters",
      "Educational/professional certificates",
      "No Objection Certificate (if applicable)"
    ],
    timeline: "5-7 business days",
    jurisdictions: ["Free Zone"],
    entityTypes: ["fzc"]
  },
  "mainland-company": {
    title: "Mainland Company",
    description: "Mainland business establishment",
    overview: "Set up your business in UAE mainland to access the entire local market, bid for government contracts, and establish a strong presence in the region.",
    benefits: [
      "Access to UAE domestic market",
      "Ability to bid for government contracts",
      "No restrictions on business location",
      "Can sponsor family visas",
      "Unlimited business activities",
      "Banking advantages"
    ],
    documents: [
      "Passport copies and visas",
      "No Objection Certificate",
      "Tenancy contract for office space",
      "Business plan",
      "Bank statements",
      "Professional certificates"
    ],
    timeline: "10-15 business days",
    jurisdictions: ["Mainland"],
    entityTypes: ["llc", "sole"]
  },
  "branch-office": {
    title: "Branch Office",
    description: "Foreign company branch registration",
    overview: "Establish a branch office of your existing foreign company in the UAE to expand your business operations and market presence.",
    benefits: [
      "Leverage parent company's reputation",
      "Simplified setup process",
      "Direct business operations",
      "Local market presence",
      "Corporate banking facilities"
    ],
    documents: [
      "Parent company documents",
      "Board resolution",
      "Power of attorney",
      "Passport copies of authorized persons",
      "Parent company bank statements",
      "Audited financial statements"
    ],
    timeline: "7-10 business days",
    jurisdictions: ["Mainland", "Free Zone"],
    entityTypes: ["branch"]
  },
  "representative-office": {
    title: "Representative Office",
    description: "Non-trading office setup",
    overview: "Establish a representative office to promote your parent company's business, conduct market research, and facilitate business relationships without direct trading activities.",
    benefits: [
      "Market research and promotion",
      "Lower setup costs",
      "Simplified compliance requirements",
      "Business relationship facilitation",
      "Regional presence establishment"
    ],
    documents: [
      "Parent company registration documents",
      "Board resolution",
      "Power of attorney",
      "Financial statements",
      "Business profile",
      "Bank reference letters"
    ],
    timeline: "5-7 business days",
    jurisdictions: ["Mainland"],
    entityTypes: ["representative"]
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? serviceDetails[serviceId as keyof typeof serviceDetails] : null;

  if (!service) {
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
            <h1 className="text-2xl font-bold text-foreground">{service.title}</h1>
            <p className="text-muted-foreground">{service.description}</p>
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
            <p className="text-muted-foreground leading-relaxed">{service.overview}</p>
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
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {service.documents.map((document, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{document}</span>
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
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{service.timeline}</p>
              <p className="text-sm text-muted-foreground">Typical processing time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Jurisdictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {service.jurisdictions.map((jurisdiction, index) => (
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
              Get an instant cost estimate and start your company formation process
            </p>
            <Link 
              to={`/company-formation/${serviceId}`}
              state={{ 
                serviceTitle: service.title,
                entityTypes: service.entityTypes,
                jurisdictions: service.jurisdictions
              }}
            >
              <Button size="lg" className="w-full">
                Start Application Process
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServiceDetail;