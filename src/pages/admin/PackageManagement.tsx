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
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  description: string;
  location: string;
}

interface CustomPackage {
  id: string;
  name: string;
  description: string;
  zone_id: string;
  package_type: string;
  max_activities: number;
  max_shareholders: number;
  max_visas: number;
  tenure_years: number[];
  base_price: number;
  per_activity_price: number;
  per_shareholder_price: number;
  per_visa_price: number;
  included_services: string[];
  zones?: Zone;
}

const PackageManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CustomPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    zone_id: "",
    package_type: "basic",
    max_activities: 1,
    max_shareholders: 1,
    max_visas: 0,
    tenure_years: [1],
    base_price: 0,
    per_activity_price: 0,
    per_shareholder_price: 0,
    per_visa_price: 0,
    included_services: []
  });

  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ["custom-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_packages")
        .select(`
          *,
          zones (
            id,
            name,
            zone_type,
            description,
            location
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CustomPackage[];
    }
  });

  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data as Zone[];
    }
  });

  const createPackageMutation = useMutation({
    mutationFn: async (packageData: any) => {
      const { data, error } = await supabase
        .from("custom_packages")
        .insert([packageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-packages"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Package created successfully");
    },
    onError: (error) => {
      toast.error("Error creating package: " + error.message);
    }
  });

  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, ...packageData }: any) => {
      const { data, error } = await supabase
        .from("custom_packages")
        .update(packageData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-packages"] });
      setIsDialogOpen(false);
      setEditingPackage(null);
      resetForm();
      toast.success("Package updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating package: " + error.message);
    }
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("custom_packages")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-packages"] });
      toast.success("Package deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting package: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      zone_id: "",
      package_type: "basic",
      max_activities: 1,
      max_shareholders: 1,
      max_visas: 0,
      tenure_years: [1],
      base_price: 0,
      per_activity_price: 0,
      per_shareholder_price: 0,
      per_visa_price: 0,
      included_services: []
    });
  };

  const handleEdit = (pkg: CustomPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      zone_id: pkg.zone_id,
      package_type: pkg.package_type,
      max_activities: pkg.max_activities,
      max_shareholders: pkg.max_shareholders,
      max_visas: pkg.max_visas,
      tenure_years: pkg.tenure_years,
      base_price: pkg.base_price,
      per_activity_price: pkg.per_activity_price || 0,
      per_shareholder_price: pkg.per_shareholder_price || 0,
      per_visa_price: pkg.per_visa_price || 0,
      included_services: pkg.included_services || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPackage) {
      updatePackageMutation.mutate({ id: editingPackage.id, ...formData });
    } else {
      createPackageMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Package Management</h1>
          <p className="text-muted-foreground">Create and manage custom business setup packages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Create New Package"}</DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package details" : "Add a new custom business setup package"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type</Label>
                  <Select value={formData.package_type} onValueChange={(value) => setFormData({ ...formData, package_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="zone_id">Zone</Label>
                <Select value={formData.zone_id} onValueChange={(value) => setFormData({ ...formData, zone_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones?.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.zone_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_activities">Max Activities</Label>
                  <Input
                    id="max_activities"
                    type="number"
                    min="1"
                    value={formData.max_activities}
                    onChange={(e) => setFormData({ ...formData, max_activities: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_shareholders">Max Shareholders</Label>
                  <Input
                    id="max_shareholders"
                    type="number"
                    min="1"
                    value={formData.max_shareholders}
                    onChange={(e) => setFormData({ ...formData, max_shareholders: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_visas">Max Visas</Label>
                  <Input
                    id="max_visas"
                    type="number"
                    min="0"
                    value={formData.max_visas}
                    onChange={(e) => setFormData({ ...formData, max_visas: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (AED)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="per_activity_price">Per Activity Price (AED)</Label>
                  <Input
                    id="per_activity_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.per_activity_price}
                    onChange={(e) => setFormData({ ...formData, per_activity_price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="per_shareholder_price">Per Shareholder Price (AED)</Label>
                  <Input
                    id="per_shareholder_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.per_shareholder_price}
                    onChange={(e) => setFormData({ ...formData, per_shareholder_price: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="per_visa_price">Per Visa Price (AED)</Label>
                  <Input
                    id="per_visa_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.per_visa_price}
                    onChange={(e) => setFormData({ ...formData, per_visa_price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPackageMutation.isPending || updatePackageMutation.isPending}>
                  {editingPackage ? "Update" : "Create"} Package
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {packages?.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pkg.name}
                    <Badge variant={pkg.package_type === 'premium' ? 'default' : 'secondary'}>
                      {pkg.package_type}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {pkg.zones?.name} ({pkg.zones?.zone_type})
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deletePackageMutation.mutate(pkg.id)}
                    disabled={deletePackageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Max Activities:</span> {pkg.max_activities}
                </div>
                <div>
                  <span className="font-medium">Max Shareholders:</span> {pkg.max_shareholders}
                </div>
                <div>
                  <span className="font-medium">Max Visas:</span> {pkg.max_visas}
                </div>
                <div>
                  <span className="font-medium">Base Price:</span> AED {pkg.base_price.toLocaleString()}
                </div>
              </div>
              
              {pkg.description && (
                <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackageManagement;