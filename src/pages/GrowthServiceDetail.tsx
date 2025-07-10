import { ArrowLeft, Star, Clock, Users, DollarSign, CheckCircle, Calendar, Phone, Mail, MessageSquare } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";

const serviceDetails = {
  "business-consultancy": {
    title: "Business Consultancy",
    description: "Expert business strategy and planning to accelerate your company's growth",
    rating: 4.8,
    price: "Starting from AED 1,500",
    duration: "2-4 weeks",
    clients: "500+",
    features: [
      "Business Strategy Development",
      "Market Analysis & Research", 
      "Financial Planning & Forecasting",
      "Operational Optimization",
      "Growth Strategy Planning",
      "Risk Assessment & Mitigation"
    ],
    benefits: [
      "Increase revenue by 20-40%",
      "Streamline operations",
      "Reduce operational costs",
      "Access to expert advisors",
      "Customized growth plans"
    ],
    packages: [
      {
        name: "Starter",
        price: "AED 1,500",
        duration: "2 weeks",
        features: ["Basic business analysis", "Growth recommendations", "1 follow-up session"]
      },
      {
        name: "Professional", 
        price: "AED 3,500",
        duration: "4 weeks",
        features: ["Comprehensive analysis", "Detailed strategy plan", "3 follow-up sessions", "Financial projections"]
      },
      {
        name: "Enterprise",
        price: "AED 6,000", 
        duration: "6 weeks",
        features: ["Full business transformation", "Ongoing support", "Team training", "Implementation assistance"]
      }
    ],
    faqs: [
      {
        question: "How long does the consultation process take?",
        answer: "Depending on your package, consultations range from 2-6 weeks with ongoing support."
      },
      {
        question: "Do you provide industry-specific advice?",
        answer: "Yes, our consultants specialize in various industries including tech, retail, healthcare, and more."
      }
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing",
    description: "Complete digital marketing solutions to boost your online presence and drive sales",
    rating: 4.9,
    price: "Starting from AED 2,000",
    duration: "3-6 months",
    clients: "300+",
    features: [
      "Social Media Management",
      "Google Ads & PPC",
      "SEO Optimization",
      "Content Marketing",
      "Email Marketing Campaigns",
      "Analytics & Reporting"
    ],
    benefits: [
      "Increase online visibility by 300%",
      "Generate qualified leads",
      "Improve brand awareness",
      "Higher conversion rates",
      "Detailed performance tracking"
    ],
    packages: [
      {
        name: "Basic",
        price: "AED 2,000/month",
        duration: "3 months minimum",
        features: ["Social media management", "Basic SEO", "Monthly reporting"]
      },
      {
        name: "Growth",
        price: "AED 4,500/month", 
        duration: "6 months minimum",
        features: ["Full digital strategy", "Google Ads", "Content creation", "Weekly reporting"]
      },
      {
        name: "Enterprise",
        price: "AED 8,000/month",
        duration: "12 months minimum", 
        features: ["Complete marketing suite", "Dedicated account manager", "Custom campaigns", "Daily monitoring"]
      }
    ],
    faqs: [
      {
        question: "How quickly will I see results?",
        answer: "Most clients see initial improvements within 30-60 days, with significant results after 3 months."
      },
      {
        question: "Do you work with all industries?",
        answer: "Yes, we have experience across various industries and tailor strategies accordingly."
      }
    ]
  }
};

const GrowthServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const service = serviceId ? serviceDetails[serviceId as keyof typeof serviceDetails] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link to="/growth">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Growth Services
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/growth')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{service.title}</h1>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">{service.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{service.clients} clients</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{service.duration}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {service.packages.map((pkg, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-orange">{pkg.price}</div>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    variant={index === 1 ? "default" : "outline"}
                    onClick={() => navigate(`/growth/booking/${serviceId}?package=${pkg.name.toLowerCase()}`)}
                  >
                    Select {pkg.name}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {service.faqs.map((faq, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  {index < service.faqs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>Need More Information?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Us
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-3">
          <Button 
            size="lg" 
            className="flex-1"
            onClick={() => navigate(`/growth/booking/${serviceId}`)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Consultation
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GrowthServiceDetail;