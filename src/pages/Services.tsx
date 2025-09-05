import { Building2, FileText, UserCheck, Scale, Calculator, Building, Users, Banknote, TrendingUp, Shield, Lightbulb, Globe, Monitor, Megaphone, Truck, Briefcase, ChevronRight, Search, CreditCard, Award, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const serviceCategories = [
  {
    title: "Visa & Immigration",
    icon: UserCheck,
    color: "text-brand-purple",
    bgColor: "bg-purple-50",
    services: [
      { name: "Establishment Card Application/Renewal", description: "Company establishment card processing" },
      { name: "Investor/Partner Visa Processing", description: "Investor and partner visa applications" },
      { name: "Employment Visa Processing", description: "Work permit and employment visa services" },
      { name: "Family Visa (Dependent) Applications", description: "Dependent family member visa processing" },
      { name: "Visa Cancellation & Status Change", description: "Visa cancellation and status modification services" },
      { name: "Emirates ID Application & Renewal", description: "Emirates ID processing and renewals" },
      { name: "Medical Test Appointment & Follow-Up", description: "Medical examination coordination" },
      { name: "Labour Contract Preparation & Submission", description: "Employment contract processing" }
    ]
  },
  {
    title: "Taxation",
    icon: Banknote,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    services: [
      { name: "VAT Registration & Deregistration", description: "Value Added Tax registration services" },
      { name: "VAT Return Filing & Compliance", description: "VAT return preparation and filing" },
      { name: "VAT Advisory & Health Checks", description: "VAT consultation and compliance review" },
      { name: "Corporate Tax Registration", description: "Corporate tax registration and setup" },
      { name: "CT Return Filing & Advisory", description: "Corporate tax return filing and advice" },
      { name: "QFZP/Exempt Status Planning", description: "Qualifying free zone person status planning" },
      { name: "Tax Structuring & Optimization", description: "Tax planning and optimization strategies" }
    ]
  },
  {
    title: "Accounting & Bookkeeping",
    icon: Calculator,
    color: "text-brand-orange",
    bgColor: "bg-orange-50",
    services: [
      { name: "Monthly & Quarterly Bookkeeping", description: "Regular bookkeeping and financial record maintenance" },
      { name: "Financial Statement Preparation", description: "Comprehensive financial statement preparation" },
      { name: "Management Reporting", description: "Management reports and financial analysis" },
      { name: "IFRS-Compliant Accounting", description: "International financial reporting standards compliance" }
    ]
  },
  {
    title: "Payroll & HR",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    services: [
      { name: "Payroll Processing & Payslip Generation", description: "Complete payroll management services" },
      { name: "WPS Compliance & Reporting", description: "Wage Protection System compliance" },
      { name: "Employee Expense Management", description: "Employee expense tracking and management" },
      { name: "HR Policy & Leave Tracking Systems", description: "HR policy development and leave management" }
    ]
  },
  {
    title: "Legal & Compliance",
    icon: Scale,
    color: "text-red-600",
    bgColor: "bg-red-50",
    services: [
      { name: "Labour Card & WPS Setup", description: "Labour card and wage protection system setup" },
      { name: "Company Immigration & Labour File Opening", description: "Immigration and labour file establishment" },
      { name: "GOSI Registration (if applicable)", description: "General Organization for Social Insurance registration" },
      { name: "Renewal Reminders & Compliance Tracking", description: "Compliance monitoring and renewal tracking" },
      { name: "E-Signature Card Application", description: "Digital signature card processing" },
      { name: "ESR, UBO & AML Reporting", description: "Economic substance, beneficial ownership, and anti-money laundering reporting" },
      { name: "Economic Substance Notifications & Reports", description: "Economic substance regulation compliance" },
      { name: "Corporate Governance Support", description: "Corporate governance advisory and support" }
    ]
  },
  {
    title: "Payment & Accounting",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    services: [
      { name: "External Audit Coordination", description: "External audit coordination and support" },
      { name: "Internal Audit & Risk Reviews", description: "Internal audit and risk assessment services" },
      { name: "Statutory Compliance Reviews", description: "Regulatory compliance audits" },
      { name: "Agreed-Upon Procedures (AUP)", description: "Agreed-upon procedures engagements" }
    ]
  },
  {
    title: "Company Setup & Licenses",
    icon: Building2,
    color: "text-brand-blue",
    bgColor: "bg-blue-50",
    services: [
      { name: "Trade License Application & Renewals", description: "Complete trade license processing and renewals" },
      { name: "Name Reservation & Initial Approvals", description: "Business name registration and approval" },
      { name: "Drafting & Notarization of MOA/LSA Agreements", description: "Legal document preparation and notarization" },
      { name: "Chamber of Commerce Registration", description: "Registration with local chamber of commerce" },
      { name: "DED & Free Zone License Processes", description: "Department of Economic Development licensing" }
    ]
  },
  {
    title: "Government Approvals & Certificates",
    icon: Award,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    services: [
      { name: "Coordination with MOHRE, GDRFA, DED, MOFA", description: "Government department coordination" },
      { name: "Document Clearance with Government Departments", description: "Official document processing" },
      { name: "Municipality Approvals & Permits", description: "Local authority permits and approvals" },
      { name: "Health Authority Licensing (DHA/DOH/MOH)", description: "Health sector licensing and permits" }
    ]
  },
  {
    title: "Advisory & Growth",
    icon: TrendingUp,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    services: [
      { name: "Cross-Border Tax Advisory", description: "International tax planning and advisory" },
      { name: "Transfer Pricing Support", description: "Transfer pricing documentation and compliance" },
      { name: "M&A Due Diligence & Valuation", description: "Mergers and acquisitions due diligence" },
      { name: "CFO & Virtual Finance Office Services", description: "Outsourced CFO and finance office services" }
    ]
  },
  {
    title: "Attestation & Consular",
    icon: FileText,
    color: "text-brand-green",
    bgColor: "bg-green-50",
    services: [
      { name: "Attestation of Educational, Commercial & POA Documents", description: "Document attestation services" },
      { name: "MOFA Attestation", description: "Ministry of Foreign Affairs attestation" },
      { name: "Consulate/Embassy Legalization", description: "Diplomatic legalization services" },
      { name: "Legal Translation & Notarization Support", description: "Translation and notarization services" }
    ]
  },
  {
    title: "Other Services",
    icon: Briefcase,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    services: [
      { name: "Typing Center Services", description: "Document typing and processing services" },
      { name: "Courier Coordination for Documents", description: "Document delivery and courier services" },
      { name: "Assistance with Fines, Penalties & Dispute Resolution", description: "Fine resolution and dispute handling" },
      { name: "Vehicle Registration & Renewal", description: "Vehicle registration and renewal services" },
      { name: "Tenancy Contract Registration (Ejari)", description: "Tenancy contract registration services" },
      { name: "Bank Account Opening Support", description: "Bank account opening assistance" },
      { name: "Health Insurance Registration", description: "Health insurance registration support" }
    ]
  }
];

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getServiceId = (serviceName: string) => {
    const serviceMap: { [key: string]: string } = {
      "LLC Formation": "llc-formation",
      "Free Zone Company": "free-zone-company", 
      "Mainland Company": "mainland-company",
      "Branch Office": "branch-office",
      "Representative Office": "representative-office"
    };
    return serviceMap[serviceName];
  };

  const handleServiceClick = (service: { name: string; description: string }, categoryTitle: string) => {
    if (categoryTitle === "Company Formation") {
      const serviceId = getServiceId(service.name);
      if (serviceId) {
        navigate(`/service/${serviceId}`);
      }
    }
  };

  const handleCategoryClick = (categoryTitle: string) => {
    const categoryMap: { [key: string]: string } = {
      "Visa & Immigration": "visa-immigration", 
      "Taxation": "taxation-services",
      "Accounting & Bookkeeping": "accounting-bookkeeping",
      "Payroll & HR": "payroll-hr-compliance",
      "Legal & Compliance": "legal-compliance",
      "Payment & Accounting": "audit-assurance",
      "Company Setup & Licenses": "company-formation",
      "Government Approvals & Certificates": "government-liaison-approvals",
      "Advisory & Growth": "advisory-strategic-consulting",
      "Attestation & Consular": "attestation-legalization",
      "Other Services": "other-support-services"
    };
    
    const categoryId = categoryMap[categoryTitle];
    if (categoryId) {
      navigate(`/service-category/${categoryId}`);
    }
  };

  const filteredCategories = serviceCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.services.some(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Business Services</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
          />
        </div>
      </div>

      {/* Service Categories */}
      <div className="p-4 space-y-4">
        {filteredCategories.map((category, index) => (
          <Card 
            key={index} 
            className="border-none shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-0">
              {/* Category Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleCategoryClick(category.title)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.services.length} services available
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      selectedCategory === category.title ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
              </div>

              {/* Expanded Services */}
              {selectedCategory === category.title && (
                <div className="border-t border-border">
                  {category.services.map((service, serviceIndex) => (
                    <div 
                      key={serviceIndex}
                      className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleServiceClick(service, category.title)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">Mainland</Badge>
                            <Badge variant="secondary" className="text-xs">Free Zone</Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNavigation />
      
    </div>
  );
};

export default Services;