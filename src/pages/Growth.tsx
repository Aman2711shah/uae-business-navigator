import { TrendingUp, Megaphone, Users, Globe, Search, Settings, Lightbulb, DollarSign, BookOpen, Award, Calendar, Star, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const growthServices = [
  {
    title: "Business Consultancy",
    icon: Lightbulb,
    color: "text-brand-blue",
    bgColor: "bg-blue-50",
    description: "Unlock expert business strategy and planning tailored to your industry",
    fullDescription: "Our consultants help refine your goals, optimize processes, and build actionable roadmaps for success.",
    price: "Starting from AED 1,500",
    rating: 4.8,
    popular: true
  },
  {
    title: "Digital Marketing", 
    icon: Megaphone,
    color: "text-brand-purple",
    bgColor: "bg-purple-50",
    description: "Maximize your online presence with comprehensive digital marketing services",
    fullDescription: "From social media to SEO, we craft campaigns that drive traffic, leads, and conversions.",
    price: "Starting from AED 2,000",
    rating: 4.9,
    popular: true
  },
  {
    title: "Website Development",
    icon: Globe,
    color: "text-brand-green", 
    bgColor: "bg-green-50",
    description: "Build a powerful digital foundation with custom website solutions",
    fullDescription: "Whether you're launching a brand or scaling up, we create user-friendly, mobile-responsive sites.",
    price: "Starting from AED 3,000",
    rating: 4.7,
    popular: false
  },
  {
    title: "Business Networking",
    icon: Users,
    color: "text-brand-orange",
    bgColor: "bg-orange-50", 
    description: "Connect with industry leaders through exclusive networking events",
    fullDescription: "Expand your business connections and explore partnerships through our platforms.",
    price: "Starting from AED 500",
    rating: 4.6,
    popular: false
  },
  {
    title: "Investor Assistance",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Gain access to funding through expert advisory and connections",
    fullDescription: "We assist in investor matchmaking, pitch deck development, and funding strategy.",
    price: "Starting from AED 2,500", 
    rating: 4.8,
    popular: true
  },
  {
    title: "Business Training",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Empower your team with specialized workshops and training programs",
    fullDescription: "Learn essential business, marketing, and leadership skills from industry experts.",
    price: "Starting from AED 800",
    rating: 4.5,
    popular: false
  }
];

const successStories = [
  {
    company: "TechStart Dubai",
    industry: "Technology",
    growth: "300% revenue increase",
    story: "From a small startup to a leading tech company in 18 months",
    image: "/placeholder.svg"
  },
  {
    company: "Green Foods UAE",
    industry: "F&B",
    growth: "5 new branches",
    story: "Expanded from single restaurant to food chain across UAE",
    image: "/placeholder.svg"
  },
  {
    company: "Digital Solutions Pro",
    industry: "Digital Marketing",
    growth: "200+ clients",
    story: "Built a thriving digital agency serving major brands",
    image: "/placeholder.svg"
  }
];

const upcomingWorkshops = [
  {
    title: "Digital Marketing Masterclass",
    date: "Dec 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Dubai Business Bay",
    spots: 12,
    price: "AED 299"
  },
  {
    title: "Investment & Funding Workshop",
    date: "Dec 20, 2024", 
    time: "10:00 AM - 1:00 PM",
    location: "Abu Dhabi",
    spots: 8,
    price: "AED 499"
  }
];

const Growth = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>([]);

  const handleBookmark = (serviceTitle: string) => {
    setBookmarkedServices(prev => 
      prev.includes(serviceTitle) 
        ? prev.filter(s => s !== serviceTitle)
        : [...prev, serviceTitle]
    );
  };

  const filteredServices = growthServices.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceId = (serviceTitle: string) => {
    return serviceTitle.toLowerCase().replace(/\s+/g, '-');
  };

  const handleLearnMore = (serviceTitle: string) => {
    const serviceId = getServiceId(serviceTitle);
    navigate(`/growth/service/${serviceId}`);
  };

  const handleBookConsultation = (serviceTitle: string) => {
    const serviceId = getServiceId(serviceTitle);
    navigate(`/growth/booking/${serviceId}`);
  };

  const handleWorkshopRegister = (workshopTitle: string) => {
    const workshopId = workshopTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/growth/workshop/${workshopId}/register`);
  };

  const handleSuccessStoryClick = (companyName: string) => {
    const storyId = companyName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/growth/success-story/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Growth Services</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search growth services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Featured Offer */}
        <Card className="border-none shadow-lg overflow-hidden">
          <div 
            className="p-6 text-white"
            style={{
              background: 'var(--gradient-orange)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 Growth Package</h3>
                <p className="text-white/90 mb-3">Complete business growth solution</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  Limited Time: 30% OFF
                </Badge>
              </div>
              <Button variant="orange-outline" className="bg-white text-brand-orange" onClick={() => navigate('/growth/package')}>
                Learn More
              </Button>
            </div>
          </div>
        </Card>

        {/* Growth Services */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Growth Services</h2>
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{service.title}</h3>
                            {service.popular && (
                              <Badge className="bg-brand-orange text-brand-orange-foreground text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{service.rating}</span>
                            </div>
                            <span className="text-sm font-medium text-brand-orange">{service.price}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleBookmark(service.title)}
                          className="flex-shrink-0"
                        >
                          {bookmarkedServices.includes(service.title) ? (
                            <BookmarkCheck className="h-4 w-4 text-brand-orange" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="orange" 
                          className="flex-1"
                          onClick={() => handleBookConsultation(service.title)}
                        >
                          Book Consultation
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleLearnMore(service.title)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Success Stories</h2>
          <div className="space-y-3">
            {successStories.map((story, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div 
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => handleSuccessStoryClick(story.company)}
                  >
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{story.company}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{story.industry}</Badge>
                        <Badge variant="outline" className="text-xs text-green-600">
                          {story.growth}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{story.story}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Workshops */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Workshops</h2>
          <div className="space-y-3">
            {upcomingWorkshops.map((workshop, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{workshop.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">
                        <p>{workshop.date} • {workshop.time}</p>
                        <p>{workshop.location}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {workshop.spots} spots left
                          </Badge>
                          <span className="text-sm font-medium text-brand-orange">
                            {workshop.price}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="orange"
                          onClick={() => handleWorkshopRegister(workshop.title)}
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Growth;