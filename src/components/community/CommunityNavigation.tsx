import { useState } from 'react';
import { ArrowLeft, Users, Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunityNavigationProps {
  selectedIndustries: string[];
  currentIndustry: string;
  onIndustryChange: (industry: string) => void;
  onBack: () => void;
  userProfile?: any;
}

export default function CommunityNavigation({ 
  selectedIndustries, 
  currentIndustry, 
  onIndustryChange, 
  onBack,
  userProfile 
}: CommunityNavigationProps) {
  return (
    <div className="bg-card border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Community</h1>
              <p className="text-sm text-muted-foreground">
                {userProfile?.company_name || 'Your Business Network'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Industry Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {selectedIndustries.map((industry) => (
            <Button
              key={industry}
              variant={currentIndustry === industry ? "default" : "outline"}
              size="sm"
              onClick={() => onIndustryChange(industry)}
              className="shrink-0"
            >
              <Users className="h-4 w-4 mr-2" />
              {industry}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}