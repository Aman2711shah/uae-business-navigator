import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SpecialOffer = () => {
  return (
    <div className="px-4 sm:px-6 pb-6">
      <Card className="relative overflow-hidden border-none shadow-glow">
        <div className="p-4 sm:p-6 rounded-xl bg-gradient-blue">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-primary-foreground mb-2">Special Offer</h3>
              <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed">
                Free business consultation with every setup package
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-card text-primary hover:bg-card/90 font-semibold px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base shadow-button w-full sm:w-auto"
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