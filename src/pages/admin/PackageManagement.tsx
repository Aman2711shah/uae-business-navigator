import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  type: 'mainland' | 'freezone';
  description: string;
  location: string;
  key_benefits: string[];
  contact_info: any;
  is_active: boolean;
}

interface CustomPackage {
  id: string;
  name: string;
  description: string;
  package_type: string;
  base_price: number;
  max_activities: number;
  max_shareholders: number;
  max_visas: number;
  tenure_years: number[];
  zone_id: string;
  zone?: Zone;
  is_mainland: boolean;
  setup_timeline_days: number;
  min_share_capital: number;
  included_services: string[];
  is_active: boolean;
}

const PackageManagement = () => {
  const [packages, setPackages] = useState<CustomPackage[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [editingPackage, setEditingPackage] = useState<CustomPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    package_type: '',
    base_price: 0,
    max_activities: 1,
    max_shareholders: 1,
    max_visas: 0,
    tenure_years: [1],
    zone_id: '',
    is_mainland: false,
    setup_timeline_days: 30,
    min_share_capital: 0,
    included_services: [''],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch packages with zone information
      const { data: packagesData, error: packagesError } = await supabase
        .from('custom_packages')
        .select(`
          *,
          zone:zones(*)
        `)
        .order('created_at', { ascending: false });

      if (packagesError) throw packagesError;

      // Fetch zones
      const { data: zonesData, error: zonesError } = await supabase
        .from('zones')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (zonesError) throw zonesError;

      setPackages((packagesData || []).map(pkg => ({
        ...pkg,
        zone: pkg.zone ? { 
          ...pkg.zone, 
          type: pkg.zone.zone_type as 'mainland' | 'freezone' 
        } : undefined
      })));
      setZones((zonesData || []).map(zone => ({ 
        ...zone, 
        type: zone.zone_type as 'mainland' | 'freezone' 
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const packageData = {
        ...formData,
        included_services: formData.included_services.filter(s => s.trim() !== ''),
      };

      if (editingPackage) {
        const { error } = await supabase
          .from('custom_packages')
          .update(packageData)
          .eq('id', editingPackage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('custom_packages')
          .insert(packageData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package created successfully"
        });
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (pkg: CustomPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      package_type: pkg.package_type,
      base_price: pkg.base_price,
      max_activities: pkg.max_activities,
      max_shareholders: pkg.max_shareholders,
      max_visas: pkg.max_visas,
      tenure_years: pkg.tenure_years,
      zone_id: pkg.zone_id || '',
      is_mainland: pkg.is_mainland,
      setup_timeline_days: pkg.setup_timeline_days,
      min_share_capital: pkg.min_share_capital,
      included_services: pkg.included_services || [''],
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('custom_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      package_type: '',
      base_price: 0,
      max_activities: 1,
      max_shareholders: 1,
      max_visas: 0,
      tenure_years: [1],
      zone_id: '',
      is_mainland: false,
      setup_timeline_days: 30,
      min_share_capital: 0,
      included_services: [''],
    });
    setEditingPackage(null);
    setIsCreating(false);
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      included_services: [...prev.included_services, '']
    }));
  };

  const updateService = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      included_services: prev.included_services.map((service, i) => 
        i === index ? value : service
      )
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      included_services: prev.included_services.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPackage ? 'Edit Package' : 'Create New Package'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="package_type">Package Type</Label>
                  <Select value={formData.package_type} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, package_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base_price">Base Price (AED)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="max_activities">Max Activities</Label>
                  <Input
                    id="max_activities"
                    type="number"
                    value={formData.max_activities}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_activities: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="max_shareholders">Max Shareholders</Label>
                  <Input
                    id="max_shareholders"
                    type="number"
                    value={formData.max_shareholders}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_shareholders: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max_visas">Max Visas</Label>
                  <Input
                    id="max_visas"
                    type="number"
                    value={formData.max_visas}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_visas: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="setup_timeline">Setup Timeline (days)</Label>
                  <Input
                    id="setup_timeline"
                    type="number"
                    value={formData.setup_timeline_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, setup_timeline_days: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_share_capital">Min Share Capital (AED)</Label>
                  <Input
                    id="min_share_capital"
                    type="number"
                    value={formData.min_share_capital}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_share_capital: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zone">Zone</Label>
                <Select value={formData.zone_id} onValueChange={(value) => {
                  const selectedZone = zones.find(z => z.id === value);
                  setFormData(prev => ({ 
                    ...prev, 
                    zone_id: value,
                    is_mainland: selectedZone?.type === 'mainland'
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Included Services</Label>
                {formData.included_services.map((service, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder="Service description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addService} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingPackage ? 'Update' : 'Create'} Package
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pkg.name}
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {pkg.zone?.name} ({pkg.zone?.type})
                    </Badge>
                  </CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Base Price:</strong> AED {pkg.base_price.toLocaleString()}
                </div>
                <div>
                  <strong>Max Activities:</strong> {pkg.max_activities}
                </div>
                <div>
                  <strong>Max Shareholders:</strong> {pkg.max_shareholders}
                </div>
                <div>
                  <strong>Max Visas:</strong> {pkg.max_visas}
                </div>
                <div>
                  <strong>Setup Time:</strong> {pkg.setup_timeline_days} days
                </div>
                <div>
                  <strong>Min Capital:</strong> AED {pkg.min_share_capital.toLocaleString()}
                </div>
                <div>
                  <strong>Type:</strong> {pkg.package_type}
                </div>
                <div>
                  <strong>Tenure:</strong> {pkg.tenure_years.join(', ')} years
                </div>
              </div>
              {pkg.included_services && pkg.included_services.length > 0 && (
                <div className="mt-4">
                  <strong>Included Services:</strong>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    {pkg.included_services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackageManagement;