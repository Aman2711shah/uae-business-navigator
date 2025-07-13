import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Users, CheckCircle, Calendar, MessageCircle, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { growthServices } from "@/data/growthData";

const GrowthServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('basic');

  // Find service by converting serviceId back to title
  const service = growthServices.find(s => 
    s.title.toLowerCase().replace(/\s+/g, '-') === serviceId
  );

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested service could not be found.</p>
          <Button onClick={() => navigate('/growth')}>Back to Growth</Button>
        </div>
      </div>
    );
  }

  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: service.price,
      duration: '2-3 weeks',
      features: ['Initial consultation', 'Basic strategy document', 'Email support', '1 revision']
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: `AED ${parseInt(service.price.match(/\d+/)?.[0] || '0') * 1.5}`,
      duration: '3-4 weeks',
      features: ['Extended consultation', 'Comprehensive strategy', 'Priority support', '3 revisions', '1 follow-up session']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      price: `AED ${parseInt(service.price.match(/\d+/)?.[0] || '0') * 2.5}`,
      duration: '4-6 weeks',
      features: ['Full consultation series', 'Complete implementation plan', '24/7 support', 'Unlimited revisions', 'Monthly follow-ups']
    }
  ];

  const reviews = [
    {
      name: "Sarah Al-Mansouri",
      rating: 5,
      comment: "Exceptional service! Helped transform our business strategy completely.",
      date: "2 weeks ago",
      avatar: "/placeholder.svg"
    },
    {
      name: "Ahmed Hassan",
      rating: 5,
      comment: "Professional team with deep expertise. Highly recommended!",
      date: "1 month ago",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/growth')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-foreground flex-1">{service.title}</h1>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Service Header Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center`}>
              <service.icon className={`h-6 w-6 ${service.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {service.popular ? 'Popular' : 'Available'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overview */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Service Overview</h3>
            <p className="text-muted-foreground mb-4">{service.fullDescription}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="h-5 w-5 text-brand-blue mx-auto mb-2" />
                <div className="text-sm font-medium">2-6 weeks</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 text-brand-green mx-auto mb-2" />
                <div className="text-sm font-medium">50+ clients</div>
                <div className="text-xs text-muted-foreground">Served</div>
              </div>
              <div className="text-center">
                <CheckCircle className="h-5 w-5 text-brand-orange mx-auto mb-2" />
                <div className="text-sm font-medium">98% success</div>
                <div className="text-xs text-muted-foreground">Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Choose Your Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-brand-blue bg-brand-blue/5'
                    : 'border-border hover:border-brand-blue/50'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{pkg.name}</h4>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{pkg.price}</div>
                    <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-brand-green" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="text-xs">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.name}</span>
                      <div className="flex items-center gap-1">
                        {Array(review.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => navigate(`/growth/booking/${serviceId}?package=${selectedPackage}`)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Consultation
          </Button>
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GrowthServiceDetail;