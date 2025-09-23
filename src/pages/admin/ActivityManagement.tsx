import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface BusinessActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  activity_code: string;
  license_requirements: string[];
  minimum_capital: number;
  is_active: boolean;
  created_at: string;
}

const ActivityManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<BusinessActivity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    activity_code: "",
    license_requirements: [] as string[],
    minimum_capital: 0,
    is_active: true
  });
  const [requirementInput, setRequirementInput] = useState("");

  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["business-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_activities")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BusinessActivity[];
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activityData: any) => {
      const { data, error } = await supabase
        .from("business_activities")
        .insert([activityData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-activities"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Activity created successfully");
    },
    onError: (error) => {
      toast.error("Error creating activity: " + error.message);
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...activityData }: any) => {
      const { data, error } = await supabase
        .from("business_activities")
        .update(activityData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-activities"] });
      setIsDialogOpen(false);
      setEditingActivity(null);
      resetForm();
      toast.success("Activity updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating activity: " + error.message);
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("business_activities")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-activities"] });
      toast.success("Activity deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting activity: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      activity_code: "",
      license_requirements: [],
      minimum_capital: 0,
      is_active: true
    });
    setRequirementInput("");
  };

  const handleEdit = (activity: BusinessActivity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description || "",
      category: activity.category,
      activity_code: activity.activity_code || "",
      license_requirements: activity.license_requirements || [],
      minimum_capital: activity.minimum_capital || 0,
      is_active: activity.is_active
    });
    setIsDialogOpen(true);
  };

  const addRequirement = () => {
    if (requirementInput.trim() && !formData.license_requirements.includes(requirementInput.trim())) {
      setFormData({
        ...formData,
        license_requirements: [...formData.license_requirements, requirementInput.trim()]
      });
      setRequirementInput("");
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData({
      ...formData,
      license_requirements: formData.license_requirements.filter(r => r !== requirement)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingActivity) {
      updateActivityMutation.mutate({ id: editingActivity.id, ...formData });
    } else {
      createActivityMutation.mutate(formData);
    }
  };

  // Group activities by category
  const groupedActivities = activities?.reduce((groups, activity) => {
    const category = activity.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(activity);
    return groups;
  }, {} as Record<string, BusinessActivity[]>);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Management</h1>
          <p className="text-muted-foreground">Manage business activities and their descriptions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingActivity ? "Edit Activity" : "Create New Activity"}</DialogTitle>
              <DialogDescription>
                {editingActivity ? "Update activity details" : "Add a new business activity"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Activity Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity_code">Activity Code</Label>
                  <Input
                    id="activity_code"
                    value={formData.activity_code}
                    onChange={(e) => setFormData({ ...formData, activity_code: e.target.value })}
                    placeholder="e.g., GT001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Trading, Technology, Finance"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimum_capital">Minimum Capital (AED)</Label>
                  <Input
                    id="minimum_capital"
                    type="number"
                    min="0"
                    value={formData.minimum_capital}
                    onChange={(e) => setFormData({ ...formData, minimum_capital: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>License Requirements</Label>
                <div className="flex space-x-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add a license requirement"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.license_requirements.map((requirement, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeRequirement(requirement)}>
                      {requirement} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createActivityMutation.isPending || updateActivityMutation.isPending}>
                  {editingActivity ? "Update" : "Create"} Activity
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedActivities || {}).map(([category, categoryActivities]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {category} ({categoryActivities.length})
            </h2>
            
            <div className="grid gap-4">
              {categoryActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {activity.name}
                          {activity.activity_code && (
                            <Badge variant="outline">{activity.activity_code}</Badge>
                          )}
                          {!activity.is_active && <Badge variant="destructive">Inactive</Badge>}
                        </CardTitle>
                        <CardDescription>
                          {activity.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(activity)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteActivityMutation.mutate(activity.id)}
                          disabled={deleteActivityMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {activity.minimum_capital > 0 && (
                        <div>
                          <span className="font-medium">Minimum Capital:</span> AED {activity.minimum_capital.toLocaleString()}
                        </div>
                      )}
                      
                      {activity.license_requirements && activity.license_requirements.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="font-medium">License Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activity.license_requirements.map((requirement, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {requirement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityManagement;