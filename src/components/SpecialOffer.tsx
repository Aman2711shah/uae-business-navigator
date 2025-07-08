import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SpecialOffer = () => {
  return (
    <div className="px-4 pb-6">
      <Card className="relative overflow-hidden border-none shadow-lg">
        <div 
          className="p-6 rounded-xl"
          style={{
            background: 'var(--gradient-orange)',
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Special Offer</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Free business consultation with every setup package
              </p>
            </div>
            <Button 
              variant="orange-outline" 
              className="bg-white text-brand-orange border-white hover:bg-brand-orange/10 font-semibold px-6"
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