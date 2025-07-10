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
    description: "Unlock expert business strategy and planning tailored to your industry. Our consultants help refine your goals, optimize processes, and build actionable roadmaps for success.",
    rating: 4.8,
    price: "Starting from AED 1,500",
    duration: "2-4 weeks",
    clients: "500+",
    features: [
      "Strategic Growth Planning",
      "Market Expansion Guidance", 
      "Business Model Optimization",
      "Financial Planning & Forecasting",
      "Operational Optimization",
      "Risk Assessment & Mitigation"
    ],
    benefits: [
      "Strategic Growth Planning",
      "Market Expansion Guidance",
      "Business Model Optimization",
      "Increase revenue by 20-40%",
      "Access to expert advisors"
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
    description: "Maximize your online presence with our comprehensive digital marketing services. From social media to SEO, we craft campaigns that drive traffic, leads, and conversions.",
    rating: 4.9,
    price: "Starting from AED 2,000",
    duration: "3-6 months",
    clients: "300+",
    features: [
      "Social Media Campaigns",
      "SEO Optimization",
      "Performance Analytics",
      "Google Ads & PPC",
      "Content Marketing",
      "Email Marketing Campaigns"
    ],
    benefits: [
      "Social Media Campaigns",
      "SEO Optimization", 
      "Performance Analytics",
      "Increase online visibility by 300%",
      "Higher conversion rates"
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
  },
  "website-development": {
    title: "Website Development",
    description: "Build a powerful digital foundation with custom website and e-commerce solutions. Whether you're launching a brand or scaling up, we create user-friendly, mobile-responsive sites.",
    rating: 4.7,
    price: "Starting from AED 3,000",
    duration: "4-8 weeks",
    clients: "200+",
    features: [
      "Custom Website Design",
      "E-commerce Integrations", 
      "Fast & Secure Platforms",
      "Mobile-Responsive Design",
      "SEO-Optimized Structure",
      "Content Management System"
    ],
    benefits: [
      "Custom Website Design",
      "E-commerce Integrations",
      "Fast & Secure Platforms",
      "Professional online presence",
      "Mobile-responsive design"
    ],
    packages: [
      {
        name: "Basic",
        price: "AED 3,000",
        duration: "4 weeks",
        features: ["5-page website", "Mobile responsive", "Basic SEO setup"]
      },
      {
        name: "Professional",
        price: "AED 6,500",
        duration: "6 weeks", 
        features: ["10-page website", "E-commerce ready", "Advanced SEO", "Contact forms"]
      },
      {
        name: "Enterprise",
        price: "AED 12,000",
        duration: "8 weeks",
        features: ["Unlimited pages", "Full e-commerce", "Custom features", "Ongoing maintenance"]
      }
    ],
    faqs: [
      {
        question: "Do you provide ongoing maintenance?",
        answer: "Yes, we offer maintenance packages to keep your website secure and updated."
      },
      {
        question: "Can you integrate with my existing systems?",
        answer: "Absolutely, we can integrate with most CRM, payment, and business management systems."
      }
    ]
  },
  "business-networking": {
    title: "Business Networking",
    description: "Connect with industry leaders and peers through our exclusive networking events and platforms. Expand your business connections and explore partnerships.",
    rating: 4.6,
    price: "Starting from AED 500",
    duration: "Ongoing",
    clients: "1000+",
    features: [
      "Access to Business Communities",
      "Event Invitations",
      "Collaboration Opportunities",
      "Industry Meetups",
      "Partner Introductions",
      "Exclusive Business Events"
    ],
    benefits: [
      "Access to Business Communities",
      "Event Invitations", 
      "Collaboration Opportunities",
      "Expand professional network",
      "Access to exclusive events"
    ],
    packages: [
      {
        name: "Basic",
        price: "AED 500/month",
        duration: "Monthly",
        features: ["Access to networking events", "Basic member directory", "Monthly meetups"]
      },
      {
        name: "Premium",
        price: "AED 1,200/month",
        duration: "Monthly",
        features: ["All basic features", "VIP event access", "One-on-one introductions", "Industry reports"]
      },
      {
        name: "Executive",
        price: "AED 2,500/month", 
        duration: "Monthly",
        features: ["All premium features", "Executive roundtables", "Private events", "Personal networking consultant"]
      }
    ],
    faqs: [
      {
        question: "What types of events do you organize?",
        answer: "We organize industry meetups, business mixers, workshops, and exclusive executive roundtables."
      },
      {
        question: "How do you match business partners?",
        answer: "Our team uses industry expertise and member profiles to facilitate relevant introductions."
      }
    ]
  },
  "investor-assistance": {
    title: "Investor Assistance", 
    description: "Gain access to funding and investment opportunities through expert advisory and network connections. We assist in investor matchmaking, pitch deck development, and more.",
    rating: 4.8,
    price: "Starting from AED 2,500",
    duration: "3-6 months",
    clients: "150+",
    features: [
      "Investment Readiness Support",
      "Investor Introductions",
      "Funding Strategy Guidance",
      "Pitch Deck Development",
      "Financial Modeling",
      "Due Diligence Preparation"
    ],
    benefits: [
      "Investment Readiness Support",
      "Investor Introductions",
      "Funding Strategy Guidance", 
      "Access to investor network",
      "Professional pitch preparation"
    ],
    packages: [
      {
        name: "Starter",
        price: "AED 2,500",
        duration: "6 weeks",
        features: ["Pitch deck review", "Investment readiness assessment", "Basic guidance"]
      },
      {
        name: "Growth",
        price: "AED 7,500", 
        duration: "3 months",
        features: ["Complete pitch deck development", "Investor introductions", "Financial modeling", "Ongoing support"]
      },
      {
        name: "Scale",
        price: "AED 15,000",
        duration: "6 months",
        features: ["Full funding strategy", "Multiple investor rounds", "Due diligence support", "Dedicated advisor"]
      }
    ],
    faqs: [
      {
        question: "What types of investors do you work with?",
        answer: "We work with angel investors, VCs, private equity firms, and family offices across various industries."
      },
      {
        question: "What is your success rate?",
        answer: "Over 75% of our clients secure funding within 6 months of completing our program."
      }
    ]
  },
  "business-training": {
    title: "Business Training",
    description: "Empower your team and yourself with specialized workshops and training programs. Learn essential business, marketing, and leadership skills from industry experts.",
    rating: 4.5,
    price: "Starting from AED 800",
    duration: "1-4 weeks",
    clients: "800+",
    features: [
      "Skill Development Workshops",
      "Customized Training Programs", 
      "Certified Trainers & Consultants",
      "Leadership Development",
      "Team Building Programs",
      "Digital Skills Training"
    ],
    benefits: [
      "Skill Development Workshops",
      "Customized Training Programs",
      "Certified Trainers & Consultants",
      "Improved team productivity",
      "Enhanced business skills"
    ],
    packages: [
      {
        name: "Workshop",
        price: "AED 800",
        duration: "1 day",
        features: ["Single workshop session", "Training materials", "Certificate of completion"]
      },
      {
        name: "Program",
        price: "AED 2,500",
        duration: "1 week",
        features: ["5-day intensive program", "Practical exercises", "Follow-up session", "Resource kit"]
      },
      {
        name: "Custom",
        price: "AED 6,000",
        duration: "4 weeks",
        features: ["Tailored curriculum", "On-site training", "Ongoing coaching", "Performance tracking"]
      }
    ],
    faqs: [
      {
        question: "Do you offer custom training programs?",
        answer: "Yes, we design custom training programs based on your specific business needs and goals."
      },
      {
        question: "Are the trainers certified?",
        answer: "All our trainers are industry-certified professionals with extensive practical experience."
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