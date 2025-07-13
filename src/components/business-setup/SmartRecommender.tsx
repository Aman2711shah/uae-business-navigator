import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Clock, DollarSign } from "lucide-react";

interface RecommendationProps {
  package: any;
  rank: number;
  isRecommended?: boolean;
  estimatedCost: number;
}

const SmartRecommender: React.FC<{
  recommendedPackage: any;
  alternativePackages: any[];
  estimatedCost: number;
  onSelectPackage?: (packageId: number) => void;
}> = ({ recommendedPackage, alternativePackages, estimatedCost, onSelectPackage }) => {
  
  const RecommendationCard: React.FC<RecommendationProps> = ({ 
    package: pkg, 
    rank, 
    isRecommended = false 
  }) => {
    const getBadgeContent = () => {
      if (rank === 1) return { text: "🏆 Best Value", variant: "default" as const };
      if (rank === 2) return { text: "💡 Popular Choice", variant: "secondary" as const };
      return { text: "⚡ Premium Option", variant: "outline" as const };
    };

    const badge = getBadgeContent();

    return (
      <Card className={`p-6 transition-all duration-300 hover:shadow-lg ${
        isRecommended 
          ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30' 
          : 'hover:border-primary/20'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isRecommended ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {rank}
            </div>
            <Badge variant={badge.variant}>{badge.text}</Badge>
          </div>
          {isRecommended && <Star className="h-5 w-5 text-primary fill-primary" />}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">{pkg.package_name}</h3>
            <p className="text-primary font-medium">{pkg.freezone_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Setup: 3-5 days</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Growth Ready</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">{pkg.included_services}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-bold text-foreground">
                AED {(pkg.calculatedCost || estimatedCost).toLocaleString()}
              </div>
              {!isRecommended && pkg.calculatedCost && (
                <div className="text-xs text-muted-foreground">
                  +{((pkg.calculatedCost - estimatedCost) / estimatedCost * 100).toFixed(0)}% vs best value
                </div>
              )}
            </div>
            <Button 
              variant={isRecommended ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectPackage?.(pkg.id)}
            >
              {isRecommended ? "Select" : "Compare"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">🤖 Smart Free Zone Recommender</h2>
        <p className="text-muted-foreground">AI-powered analysis of the best options for your business</p>
      </div>

      <div className="space-y-4">
        {recommendedPackage && (
          <RecommendationCard
            package={recommendedPackage}
            rank={1}
            isRecommended={true}
            estimatedCost={estimatedCost}
          />
        )}

        {alternativePackages.slice(0, 2).map((pkg, index) => (
          <RecommendationCard
            key={pkg.id}
            package={pkg}
            rank={index + 2}
            estimatedCost={estimatedCost}
          />
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-dashed">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Save up to 30% with our partner free zones</p>
            <p className="text-muted-foreground">Additional discounts available for multiple year packages</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmartRecommender;