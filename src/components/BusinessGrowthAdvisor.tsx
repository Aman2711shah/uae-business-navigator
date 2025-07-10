import { TrendingUp, Lightbulb, Users, Building, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface RecommendationProps {
  currentService: string;
  businessType?: string;
  companySize?: string;
  serviceCategory?: string;
}

const serviceRecommendations = {
  "government-liaison-approvals": {
    recommendations: [
      {
        id: "corporate-compliance",
        title: "Corporate Compliance",
        reason: "Essential for maintaining regulatory standing after government approvals",
        category: "compliance",
        priority: "high"
      },
      {
        id: "business-consultancy", 
        title: "Business Consultancy",
        reason: "Strategic guidance to leverage your new approvals for business growth",
        category: "growth",
        priority: "medium"
      },
      {
        id: "accounting-bookkeeping",
        title: "Accounting & Bookkeeping", 
        reason: "Proper financial records required for ongoing compliance reporting",
        category: "finance",
        priority: "high"
      }
    ],
    workshops: [
      {
        title: "Regulatory Compliance Workshop",
        date: "Dec 18, 2024",
        reason: "Learn to maintain compliance standards independently"
      }
    ]
  },
  "company-formation-licensing": {
    recommendations: [
      {
        id: "bank-account-opening",
        title: "Bank Account Opening Support",
        reason: "Essential next step after company formation to start operations",
        category: "banking",
        priority: "high"
      },
      {
        id: "visa-immigration",
        title: "Immigration & Visa Services", 
        reason: "Secure employment visas for your new company's workforce",
        category: "immigration",
        priority: "high"
      },
      {
        id: "digital-marketing",
        title: "Digital Marketing",
        reason: "Launch your brand online and attract customers to your new business",
        category: "growth", 
        priority: "medium"
      }
    ],
    workshops: [
      {
        title: "New Business Setup Masterclass",
        date: "Dec 22, 2024",
        reason: "Complete guide for new business owners in UAE"
      }
    ]
  },
  "taxation-services": {
    recommendations: [
      {
        id: "accounting-bookkeeping",
        title: "Accounting & Bookkeeping",
        reason: "Accurate records essential for tax compliance and filing",
        category: "finance",
        priority: "high"
      },
      {
        id: "audit-assurance",
        title: "Audit & Assurance", 
        reason: "Independent verification supports tax compliance credibility",
        category: "compliance",
        priority: "medium"
      },
      {
        id: "business-consultancy",
        title: "Business Consultancy",
        reason: "Tax-efficient business structure planning and optimization",
        category: "growth",
        priority: "medium"
      }
    ],
    workshops: [
      {
        title: "VAT & Corporate Tax Workshop", 
        date: "Dec 20, 2024",
        reason: "Master UAE tax requirements and optimize your tax strategy"
      }
    ]
  },
  "immigration-visa-services": {
    recommendations: [
      {
        id: "payroll-hr-compliance",
        title: "Payroll & HR Compliance",
        reason: "Manage employee payroll and WPS compliance for visa holders",
        category: "hr",
        priority: "high"
      },
      {
        id: "corporate-compliance", 
        title: "Corporate Compliance",
        reason: "Maintain labour and immigration file compliance",
        category: "compliance",
        priority: "high"
      },
      {
        id: "business-training",
        title: "Business Training",
        reason: "Upskill your new team members and improve productivity",
        category: "growth",
        priority: "low"
      }
    ],
    workshops: [
      {
        title: "HR & Employment Law Workshop",
        date: "Dec 25, 2024", 
        reason: "Understand UAE employment regulations and best practices"
      }
    ]
  }
};

const growthServiceCategories = [
  { id: "business-consultancy", title: "Business Consultancy", category: "growth" },
  { id: "digital-marketing", title: "Digital Marketing", category: "growth" },
  { id: "website-development", title: "Website Development", category: "growth" },
  { id: "business-networking", title: "Business Networking", category: "growth" },
  { id: "investor-assistance", title: "Investor Assistance", category: "growth" },
  { id: "business-training", title: "Business Training", category: "growth" }
];

const BusinessGrowthAdvisor = ({ 
  currentService, 
  businessType = "General Business", 
  companySize = "Medium",
  serviceCategory 
}: RecommendationProps) => {
  const navigate = useNavigate();
  
  const recommendations = serviceCategory && serviceRecommendations[serviceCategory as keyof typeof serviceRecommendations];
  
  if (!recommendations) return null;

  const handleServiceClick = (serviceId: string, category: string) => {
    if (category === "growth") {
      navigate(`/growth/service/${serviceId}`);
    } else {
      // Navigate to regular service category
      const categoryMap: { [key: string]: string } = {
        "corporate-compliance": "corporate-compliance",
        "accounting-bookkeeping": "accounting-bookkeeping", 
        "bank-account-opening": "other-support-services",
        "visa-immigration": "immigration-visa-services",
        "payroll-hr-compliance": "payroll-hr-compliance",
        "audit-assurance": "audit-assurance"
      };
      const categoryId = categoryMap[serviceId] || serviceId;
      navigate(`/service-category/${categoryId}`);
    }
  };

  const handleWorkshopClick = (workshopTitle: string) => {
    const workshopId = workshopTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/growth/workshop/${workshopId}/register`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "low": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return AlertCircle;
      case "medium": return TrendingUp;
      case "low": return Lightbulb;
      default: return Building;
    }
  };

  return (
    <Card className="border-brand-orange/20 bg-gradient-to-r from-orange-50 to-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-orange">
          <Lightbulb className="h-5 w-5" />
          AI Business Growth Advisor
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p><strong>Current Service:</strong> {currentService}</p>
          <p><strong>Business Type:</strong> {businessType} • <strong>Company Size:</strong> {companySize}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">🎯 Recommended Services for You</h4>
          <div className="space-y-3">
            {recommendations.recommendations.map((rec, index) => {
              const PriorityIcon = getPriorityIcon(rec.priority);
              return (
                <div 
                  key={index}
                  className="p-3 bg-white rounded-lg border border-border hover:border-brand-orange/50 cursor-pointer transition-all"
                  onClick={() => handleServiceClick(rec.id, rec.category)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(rec.priority)}`}>
                      <PriorityIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-foreground">{rec.title}</h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(rec.priority)} border-current`}
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workshops Section */}
        {recommendations.workshops && recommendations.workshops.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">📚 Recommended Workshops</h4>
            <div className="space-y-2">
              {recommendations.workshops.map((workshop, index) => (
                <div 
                  key={index}
                  className="p-3 bg-white rounded-lg border border-border hover:border-brand-orange/50 cursor-pointer transition-all"
                  onClick={() => handleWorkshopClick(workshop.title)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-foreground">{workshop.title}</h5>
                      <p className="text-xs text-muted-foreground">{workshop.date}</p>
                      <p className="text-sm text-muted-foreground mt-1">{workshop.reason}</p>
                    </div>
                    <Button size="sm" variant="orange" className="text-xs">
                      Register
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Services CTA */}
        <div className="p-3 bg-gradient-to-r from-brand-orange/10 to-amber-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-foreground">🚀 Explore Growth Services</h5>
              <p className="text-sm text-muted-foreground">Take your business to the next level</p>
            </div>
            <Button 
              size="sm" 
              variant="orange"
              onClick={() => navigate('/growth')}
            >
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessGrowthAdvisor;