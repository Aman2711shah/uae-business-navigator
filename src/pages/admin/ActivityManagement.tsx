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

interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface BusinessActivity {
  id: string;
  name: string;
  description: string;
  activity_code: string;
  category: string;
  category_id: string;
  license_requirements: string[];
  minimum_capital: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ActivityManagement = () => {
  const [activities, setActivities] = useState<BusinessActivity[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [editingActivity, setEditingActivity] = useState<BusinessActivity | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'categories'>('activities');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activity_code: '',
    category: '',
    category_id: '',
    license_requirements: [''],
    minimum_capital: 0,
    is_active: true,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('business_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('business_activity_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setActivities(activitiesData || []);
      setCategories(categoriesData || []);
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

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const activityData = {
        ...formData,
        license_requirements: formData.license_requirements.filter(req => req.trim() !== ''),
      };

      if (editingActivity) {
        const { error } = await supabase
          .from('business_activities')
          .update(activityData)
          .eq('id', editingActivity.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Activity updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('business_activities')
          .insert(activityData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Activity created successfully"
        });
      }

      resetActivityForm();
      fetchData();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: "Failed to save activity",
        variant: "destructive"
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('business_activity_categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('business_activity_categories')
          .insert(categoryFormData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category created successfully"
        });
      }

      resetCategoryForm();
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleEditActivity = (activity: BusinessActivity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description || '',
      activity_code: activity.activity_code || '',
      category: activity.category,
      category_id: activity.category_id || '',
      license_requirements: activity.license_requirements?.length ? activity.license_requirements : [''],
      minimum_capital: activity.minimum_capital || 0,
      is_active: activity.is_active,
    });
    setIsCreating(true);
  };

  const handleEditCategory = (category: ActivityCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active,
    });
    setIsCreatingCategory(true);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase
        .from('business_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Activity deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('business_activity_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const resetActivityForm = () => {
    setFormData({
      name: '',
      description: '',
      activity_code: '',
      category: '',
      category_id: '',
      license_requirements: [''],
      minimum_capital: 0,
      is_active: true,
    });
    setEditingActivity(null);
    setIsCreating(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      is_active: true,
    });
    setEditingCategory(null);
    setIsCreatingCategory(false);
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      license_requirements: [...prev.license_requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      license_requirements: prev.license_requirements.map((req, i) => 
        i === index ? value : req
      )
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      license_requirements: prev.license_requirements.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Management</h2>
          <div className="flex gap-2 mt-2">
            <Button
              variant={activeTab === 'activities' ? 'default' : 'outline'}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'default' : 'outline'}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </Button>
          </div>
        </div>
        <Button onClick={() => activeTab === 'activities' ? setIsCreating(true) : setIsCreatingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab === 'activities' ? 'Activity' : 'Category'}
        </Button>
      </div>

      {activeTab === 'activities' && (
        <>
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>{editingActivity ? 'Edit Activity' : 'Create New Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Activity Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="activity_code">Activity Code</Label>
                      <Input
                        id="activity_code"
                        value={formData.activity_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, activity_code: e.target.value }))}
                      />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category_id} onValueChange={(value) => {
                        const selectedCategory = categories.find(c => c.id === value);
                        setFormData(prev => ({ 
                          ...prev, 
                          category_id: value,
                          category: selectedCategory?.name || ''
                        }));
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="minimum_capital">Minimum Capital (AED)</Label>
                      <Input
                        id="minimum_capital"
                        type="number"
                        value={formData.minimum_capital}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimum_capital: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>License Requirements</Label>
                    {formData.license_requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={req}
                          onChange={(e) => updateRequirement(index, e.target.value)}
                          placeholder="License requirement"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addRequirement} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
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
                      {editingActivity ? 'Update' : 'Create'} Activity
                    </Button>
                    <Button type="button" variant="outline" onClick={resetActivityForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {activity.name}
                        <Badge variant={activity.is_active ? "default" : "secondary"}>
                          {activity.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {activity.category && (
                          <Badge variant="outline">
                            {activity.category}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditActivity(activity)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {activity.activity_code && (
                      <div>
                        <strong>Code:</strong> {activity.activity_code}
                      </div>
                    )}
                    {activity.minimum_capital > 0 && (
                      <div>
                        <strong>Minimum Capital:</strong> AED {activity.minimum_capital.toLocaleString()}
                      </div>
                    )}
                    {activity.license_requirements && activity.license_requirements.length > 0 && (
                      <div>
                        <strong>License Requirements:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {activity.license_requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          {isCreatingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category_name">Category Name</Label>
                    <Input
                      id="category_name"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category_description">Description</Label>
                    <Textarea
                      id="category_description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="category_is_active"
                      checked={categoryFormData.is_active}
                      onCheckedChange={(checked) => setCategoryFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="category_is_active">Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingCategory ? 'Update' : 'Create'} Category
                    </Button>
                    <Button type="button" variant="outline" onClick={resetCategoryForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {category.name}
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityManagement;