import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface FeaturedOfferProps {
  onLearnMore: () => void;
}
const FeaturedOffer = ({
  onLearnMore
}: FeaturedOfferProps) => {
  return <Card className="border-none shadow-lg overflow-hidden">
      <div className="p-6 text-white" style={{
      background: 'var(--gradient-orange)'
    }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-950">🚀 Growth Package</h3>
            <p className="mb-3 text-[#242929]">Complete business growth solution</p>
            <Badge className="text-white border-white/30 bg-slate-950">
              Limited Time: 30% OFF
            </Badge>
          </div>
          <Button variant="orange-outline" onClick={onLearnMore} className="bg-white text-brand-orange text-slate-950">
            Learn More
          </Button>
        </div>
      </div>
    </Card>;
};
export default FeaturedOffer;