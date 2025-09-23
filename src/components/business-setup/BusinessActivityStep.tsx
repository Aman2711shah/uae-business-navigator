import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/types/businessSetup";
import { useCustomPackages } from "@/hooks/useCustomPackages";

const BusinessActivityStep: React.FC<StepProps> = ({ state, setState }) => {
  const { getActivitiesByCategory, isLoading } = useCustomPackages();
  
  const activitiesByCategory = getActivitiesByCategory();

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
      
      {Object.entries(activitiesByCategory).map(([category, activities]) => {
        // Filter activities based on search term
        const filteredActivities = activities.filter(activity =>
          activity.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          activity.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        
        if (filteredActivities.length === 0) return null;
        
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">{category}</h3>
            <div className="grid grid-cols-1 gap-2">
              {filteredActivities.map((activity) => (
                <Button
                  key={activity.id}
                  variant={state.selectedActivities.includes(activity.name) ? "default" : "outline"}
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => handleActivityToggle(activity.name)}
                  disabled={!state.selectedActivities.includes(activity.name) && state.selectedActivities.length >= 3}
                >
                  <div className="text-left">
                    <div className="font-medium">{activity.name}</div>
                    {activity.description && (
                      <div className="text-xs text-muted-foreground mt-1">{activity.description}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
      
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