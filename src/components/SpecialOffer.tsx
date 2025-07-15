import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SpecialOffer = () => {
  return (
    <div className="px-4 pb-6">
      <Card className="relative overflow-hidden border-none shadow-glow">
        <div className="p-6 rounded-xl bg-gradient-blue">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary-foreground mb-2">Special Offer</h3>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                Free business consultation with every setup package
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-card text-primary hover:bg-card/90 font-semibold px-6 shadow-button"
            >
              Claim Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpecialOffer;