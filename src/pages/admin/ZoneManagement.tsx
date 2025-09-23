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
import { Switch } from '@/components/ui/switch';

interface Zone {
  id: string;
  name: string;
  type: 'mainland' | 'freezone';
  description: string;
  location: string;
  key_benefits: string[];
  contact_info: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ZoneManagement = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'freezone' as 'mainland' | 'freezone',
    description: '',
    location: '',
    key_benefits: [''],
    contact_info: {
      phone: '',
      email: '',
      website: '',
      address: ''
    },
    is_active: true,
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setZones((data || []).map(zone => ({ ...zone, type: zone.zone_type as 'mainland' | 'freezone' })));
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast({
        title: "Error",
        description: "Failed to fetch zones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const zoneData = {
        ...formData,
        key_benefits: formData.key_benefits.filter(b => b.trim() !== ''),
      };

      if (editingZone) {
        const { error } = await supabase
          .from('zones')
          .update({ ...zoneData, zone_type: zoneData.type })
          .eq('id', editingZone.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Zone updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('zones')
          .insert({ ...zoneData, zone_type: zoneData.type });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Zone created successfully"
        });
      }

      resetForm();
      fetchZones();
    } catch (error) {
      console.error('Error saving zone:', error);
      toast({
        title: "Error",
        description: "Failed to save zone",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      type: zone.type,
      description: zone.description || '',
      location: zone.location || '',
      key_benefits: zone.key_benefits?.length ? zone.key_benefits : [''],
      contact_info: zone.contact_info || {
        phone: '',
        email: '',
        website: '',
        address: ''
      },
      is_active: zone.is_active,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return;

    try {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Zone deleted successfully"
      });
      fetchZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast({
        title: "Error",
        description: "Failed to delete zone",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'freezone',
      description: '',
      location: '',
      key_benefits: [''],
      contact_info: {
        phone: '',
        email: '',
        website: '',
        address: ''
      },
      is_active: true,
    });
    setEditingZone(null);
    setIsCreating(false);
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      key_benefits: [...prev.key_benefits, '']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      key_benefits: prev.key_benefits.map((benefit, i) => 
        i === index ? value : benefit
      )
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_benefits: prev.key_benefits.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Zone Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingZone ? 'Edit Zone' : 'Create New Zone'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Zone Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Zone Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'mainland' | 'freezone') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freezone">Freezone</SelectItem>
                      <SelectItem value="mainland">Mainland</SelectItem>
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

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <Label>Key Benefits</Label>
                {formData.key_benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="Benefit description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addBenefit} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contact_info.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact_info: { ...prev.contact_info, phone: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_info.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact_info: { ...prev.contact_info, email: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.contact_info.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact_info: { ...prev.contact_info, website: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.contact_info.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact_info: { ...prev.contact_info, address: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingZone ? 'Update' : 'Create'} Zone
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
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {zone.name}
                    <Badge variant={zone.is_active ? "default" : "secondary"}>
                      {zone.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {zone.type}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{zone.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(zone)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(zone.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Location:</strong> {zone.location}
                </div>
                {zone.key_benefits && zone.key_benefits.length > 0 && (
                  <div>
                    <strong>Key Benefits:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {zone.key_benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {zone.contact_info && (
                  <div>
                    <strong>Contact Info:</strong>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                      {zone.contact_info.phone && <div>Phone: {zone.contact_info.phone}</div>}
                      {zone.contact_info.email && <div>Email: {zone.contact_info.email}</div>}
                      {zone.contact_info.website && <div>Website: {zone.contact_info.website}</div>}
                      {zone.contact_info.address && <div>Address: {zone.contact_info.address}</div>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ZoneManagement;