import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GrowthService {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
  price: string;
  rating: number;
  popular: boolean;
}

interface GrowthServiceCardProps {
  service: GrowthService;
  isBookmarked: boolean;
  onBookmark: (title: string) => void;
  onBookConsultation: (title: string) => void;
  onLearnMore: (title: string) => void;
}

const GrowthServiceCard = ({ 
  service, 
  isBookmarked, 
  onBookmark, 
  onBookConsultation, 
  onLearnMore 
}: GrowthServiceCardProps) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
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
                onClick={() => onBookmark(service.title)}
                className="flex-shrink-0"
              >
                {isBookmarked ? (
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
                onClick={() => onBookConsultation(service.title)}
              >
                Book Consultation
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onLearnMore(service.title)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthServiceCard;