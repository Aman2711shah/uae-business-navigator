import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  description: string;
  location: string;
  key_benefits: string[];
  is_active: boolean;
  created_at: string;
}

const ZoneManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    zone_type: "mainland",
    description: "",
    location: "",
    key_benefits: [] as string[],
    is_active: true
  });
  const [benefitInput, setBenefitInput] = useState("");

  const queryClient = useQueryClient();

  const { data: zones, isLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Zone[];
    }
  });

  const createZoneMutation = useMutation({
    mutationFn: async (zoneData: any) => {
      const { data, error } = await supabase
        .from("zones")
        .insert([zoneData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Zone created successfully");
    },
    onError: (error) => {
      toast.error("Error creating zone: " + error.message);
    }
  });

  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, ...zoneData }: any) => {
      const { data, error } = await supabase
        .from("zones")
        .update(zoneData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setIsDialogOpen(false);
      setEditingZone(null);
      resetForm();
      toast.success("Zone updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating zone: " + error.message);
    }
  });

  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("zones")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting zone: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      zone_type: "mainland",
      description: "",
      location: "",
      key_benefits: [],
      is_active: true
    });
    setBenefitInput("");
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      zone_type: zone.zone_type,
      description: zone.description || "",
      location: zone.location || "",
      key_benefits: zone.key_benefits || [],
      is_active: zone.is_active
    });
    setIsDialogOpen(true);
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.key_benefits.includes(benefitInput.trim())) {
      setFormData({
        ...formData,
        key_benefits: [...formData.key_benefits, benefitInput.trim()]
      });
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData({
      ...formData,
      key_benefits: formData.key_benefits.filter(b => b !== benefit)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingZone) {
      updateZoneMutation.mutate({ id: editingZone.id, ...formData });
    } else {
      createZoneMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading zones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Zone Management</h1>
          <p className="text-muted-foreground">Manage mainland and free zones for business setup</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingZone ? "Edit Zone" : "Create New Zone"}</DialogTitle>
              <DialogDescription>
                {editingZone ? "Update zone details" : "Add a new mainland or free zone"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Zone Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zone_type">Zone Type</Label>
                  <Select value={formData.zone_type} onValueChange={(value) => setFormData({ ...formData, zone_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainland">Mainland</SelectItem>
                      <SelectItem value="freezone">Free Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Dubai, UAE"
                />
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
                <Label>Key Benefits</Label>
                <div className="flex space-x-2">
                  <Input
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Add a key benefit"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button type="button" onClick={addBenefit}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.key_benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeBenefit(benefit)}>
                      {benefit} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createZoneMutation.isPending || updateZoneMutation.isPending}>
                  {editingZone ? "Update" : "Create"} Zone
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {zones?.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {zone.name}
                    <Badge variant={zone.zone_type === 'freezone' ? 'default' : 'secondary'}>
                      {zone.zone_type}
                    </Badge>
                    {!zone.is_active && <Badge variant="destructive">Inactive</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {zone.location}
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(zone)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteZoneMutation.mutate(zone.id)}
                    disabled={deleteZoneMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {zone.description && (
                <p className="mb-3 text-sm text-muted-foreground">{zone.description}</p>
              )}
              
              {zone.key_benefits && zone.key_benefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Benefits:</h4>
                  <div className="flex flex-wrap gap-1">
                    {zone.key_benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ZoneManagement;