import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StepProps } from "@/types/businessSetup";

const BusinessActivityStep: React.FC<StepProps> = ({ state, setState }) => {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  const handleActivityToggle = (activity: string) => {
    if (state.selectedActivities.includes(activity)) {
      setState({
        selectedActivities: state.selectedActivities.filter(a => a !== activity)
      });
    } else if (state.selectedActivities.length < 10) {
      setState({
        selectedActivities: [...state.selectedActivities, activity]
      });
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Business Activities</h2>
        <p className="text-muted-foreground">Choose up to 10 business activities for your company</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search business activities..."
          value={state.searchTerm}
          onChange={(e) => setState({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>
      
      {Object.entries(state.filteredActivities).map(([category, activities]) => (
        <Collapsible 
          key={category} 
          open={openCategories[category]} 
          onOpenChange={() => toggleCategory(category)}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
            >
              <h3 className="text-lg font-semibold text-foreground">{category}</h3>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openCategories[category] ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2 pl-4">
              {activities.map((activity) => (
                <Button
                  key={activity}
                  variant={state.selectedActivities.includes(activity) ? "default" : "outline"}
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => handleActivityToggle(activity)}
                  disabled={!state.selectedActivities.includes(activity) && state.selectedActivities.length >= 3}
                >
                  {activity}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      {state.selectedActivities.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-foreground mb-2">Selected Activities ({state.selectedActivities.length}/3):</h4>
          <div className="flex flex-wrap gap-2">
            {state.selectedActivities.map((activity) => (
              <Badge key={activity} variant="default" className="px-3 py-1">
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessActivityStep;