import { Building2, FileText, UserCheck, Scale, Calculator, Building, Users, Banknote, TrendingUp, Shield, Lightbulb, Globe, Monitor, Megaphone, Truck, Briefcase, ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";

const serviceCategories = [
  {
    title: "Company Formation",
    icon: Building2,
    color: "text-brand-blue",
    bgColor: "bg-blue-50",
    services: [
      { name: "LLC Formation", description: "Limited Liability Company setup in UAE" },
      { name: "Free Zone Company", description: "Business setup in UAE free zones" },
      { name: "Mainland Company", description: "Mainland business establishment" },
      { name: "Branch Office", description: "Foreign company branch registration" },
      { name: "Representative Office", description: "Non-trading office setup" }
    ]
  },
  {
    title: "Licensing Services",
    icon: FileText,
    color: "text-brand-green",
    bgColor: "bg-green-50",
    services: [
      { name: "Trade License", description: "Commercial activity license" },
      { name: "Professional License", description: "Service-based business license" },
      { name: "Industrial License", description: "Manufacturing business license" },
      { name: "Tourism License", description: "Tourism industry license" },
      { name: "License Renewal", description: "Annual license renewal service" }
    ]
  },
  {
    title: "Visa & Immigration",
    icon: UserCheck,
    color: "text-brand-purple",
    bgColor: "bg-purple-50",
    services: [
      { name: "Investor Visa", description: "Long-term investor residence visa" },
      { name: "Employee Visa", description: "Work permit and residence visa" },
      { name: "Family Visa", description: "Dependent family member visa" },
      { name: "Golden Visa", description: "10-year UAE residence visa" },
      { name: "Visit Visa", description: "Tourist and business visit visa" }
    ]
  },
  {
    title: "Legal & Compliance",
    icon: Scale,
    color: "text-red-600",
    bgColor: "bg-red-50",
    services: [
      { name: "Legal Consultation", description: "Expert legal advice" },
      { name: "Contract Drafting", description: "Business contract preparation" },
      { name: "Compliance Review", description: "Regulatory compliance check" },
      { name: "Dispute Resolution", description: "Business dispute mediation" },
      { name: "Corporate Governance", description: "Board and shareholder agreements" }
    ]
  },
  {
    title: "Tax & Accounting",
    icon: Calculator,
    color: "text-brand-orange",
    bgColor: "bg-orange-50",
    services: [
      { name: "VAT Registration", description: "Value Added Tax setup" },
      { name: "Corporate Tax", description: "Corporate tax compliance" },
      { name: "Bookkeeping", description: "Financial record maintenance" },
      { name: "Audit Services", description: "Annual financial audit" },
      { name: "Tax Consultation", description: "Tax planning and advice" }
    ]
  },
  {
    title: "Office Solutions",
    icon: Building,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    services: [
      { name: "Office Rental", description: "Physical office space rental" },
      { name: "Virtual Office", description: "Business address service" },
      { name: "Co-working Space", description: "Shared office facilities" },
      { name: "Meeting Rooms", description: "Conference room booking" },
      { name: "Mail Handling", description: "Business mail management" }
    ]
  },
  {
    title: "PRO Services",
    icon: Users,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    services: [
      { name: "Government Liaison", description: "Official document processing" },
      { name: "Ministry Approvals", description: "Government ministry clearances" },
      { name: "Municipality Services", description: "Local authority approvals" },
      { name: "Immigration Services", description: "Visa and permit processing" },
      { name: "Document Clearing", description: "Official paperwork completion" }
    ]
  },
  {
    title: "Bank Account Opening",
    icon: Banknote,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    services: [
      { name: "Corporate Banking", description: "Business bank account setup" },
      { name: "Multi-Currency Account", description: "Foreign currency accounts" },
      { name: "Islamic Banking", description: "Sharia-compliant banking" },
      { name: "Investment Accounts", description: "Business investment solutions" },
      { name: "Credit Facilities", description: "Business loan arrangements" }
    ]
  }
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
                onClick={() => setSelectedCategory(
                  selectedCategory === category.title ? null : category.title
                )}
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