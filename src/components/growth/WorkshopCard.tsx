import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Workshop {
  title: string;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
}

interface WorkshopCardProps {
  workshop: Workshop;
  onRegister: (title: string) => void;
}

const WorkshopCard = ({ workshop, onRegister }: WorkshopCardProps) => {
  return (
    <Card className="border-none shadow-sm">
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
                onClick={() => onRegister(workshop.title)}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;