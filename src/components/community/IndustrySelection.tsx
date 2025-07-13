import { useState } from 'react';
import { TrendingUp, Building2, ShoppingCart, Smartphone, Utensils, Truck, Shield, Store, Monitor, Plane, GraduationCap, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const industries = [
  { name: "Real Estate", icon: Building2, color: "text-blue-600" },
  { name: "Trading", icon: TrendingUp, color: "text-green-600" },
  { name: "E-commerce", icon: ShoppingCart, color: "text-purple-600" },
  { name: "Fintech", icon: Smartphone, color: "text-indigo-600" },
  { name: "Food & Beverage", icon: Utensils, color: "text-orange-600" },
  { name: "Logistics", icon: Truck, color: "text-red-600" },
  { name: "Health & Wellness", icon: Shield, color: "text-pink-600" },
  { name: "Retail", icon: Store, color: "text-yellow-600" },
  { name: "IT & Software", icon: Monitor, color: "text-cyan-600" },
  { name: "Tourism", icon: Plane, color: "text-emerald-600" },
  { name: "Education", icon: GraduationCap, color: "text-violet-600" },
  { name: "Media", icon: Video, color: "text-rose-600" }
];

interface IndustrySelectionProps {
  onContinue: (selectedIndustries: string[]) => void;
}

export default function IndustrySelection({ onContinue }: IndustrySelectionProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const handleIndustryToggle = (industryName: string) => {
    setSelectedIndustries(prev => {
      if (prev.includes(industryName)) {
        return prev.filter(name => name !== industryName);
      } else if (prev.length < 3) {
        return [...prev, industryName];
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Select Industry Interests
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose up to 3 industries you're interested in
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-sm">
              {selectedIndustries.length}/3 selected
            </Badge>
          </div>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {industries.map((industry, index) => {
            const isSelected = selectedIndustries.includes(industry.name);
            const isDisabled = !isSelected && selectedIndustries.length >= 3;
            
            return (
              <Card 
                key={index} 
                className={`
                  cursor-pointer transition-all duration-300 hover:shadow-md
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md scale-105' 
                    : isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-102'
                  }
                `}
                onClick={() => !isDisabled && handleIndustryToggle(industry.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center
                      ${isSelected 
                        ? 'bg-primary/20' 
                        : 'bg-muted'
                      }
                    `}>
                      <industry.icon className={`h-7 w-7 ${isSelected ? 'text-primary' : industry.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{industry.name}</h3>
                      {isSelected && (
                        <p className="text-sm text-primary font-medium">Selected</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={() => onContinue(selectedIndustries)}
            disabled={selectedIndustries.length === 0}
            size="lg"
            className="w-full max-w-md"
            variant="cta"
          >
            Continue ({selectedIndustries.length} selected)
          </Button>
          {selectedIndustries.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select at least one industry to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}