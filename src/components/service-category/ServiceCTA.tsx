import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCTAProps {
  onStartApplication: () => void;
}

const ServiceCTA = ({ onStartApplication }: ServiceCTAProps) => {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Ready to Get Started?
        </h3>
        <p className="text-muted-foreground mb-4">
          Start your application process and get an instant cost estimate
        </p>
        <Button size="lg" className="w-full" onClick={onStartApplication}>
          Start Application Process
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCTA;