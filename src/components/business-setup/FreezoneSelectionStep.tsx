import React, { useState, useEffect } from "react";
import { Search, MapPin, Building2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface FreezoneInfo {
  id: string;
  freezone_name: string;
  description: string;
  key_benefits: string[];
  office_location: string;
}

interface FreezoneSelectionStepProps {
  onSelectFreezone: (freezone: string, type: 'freezone' | 'mainland') => void;
  selectedFreezone?: string;
  selectedType?: 'freezone' | 'mainland';
}

const FreezoneSelectionStep: React.FC<FreezoneSelectionStepProps> = ({
  onSelectFreezone,
  selectedFreezone,
  selectedType
}) => {
  const [businessType, setBusinessType] = useState<'freezone' | 'mainland' | ''>(selectedType || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [freezones, setFreezones] = useState<FreezoneInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const emirates = [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
  ];

  const activityTypes = [
    'Trading', 'Consultancy', 'E-commerce', 'Technology', 'Manufacturing', 
    'Education', 'Healthcare', 'Tourism', 'Media', 'Investment'
  ];

  const mainlandOptions = [
    { name: 'Dubai Economic Department (DED)', location: 'Dubai' },
    { name: 'Abu Dhabi Department of Economic Development', location: 'Abu Dhabi' },
    { name: 'Sharjah Economic Development Department', location: 'Sharjah' },
    { name: 'Ajman Department of Economic Development', location: 'Ajman' },
    { name: 'RAK Economic Zone', location: 'Ras Al Khaimah' }
  ];

  useEffect(() => {
    if (businessType === 'freezone') {
      fetchFreezones();
    }
  }, [businessType]);

  const fetchFreezones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('freezone_public_info')
        .select('*');

      if (error) throw error;
      setFreezones(data || []);
    } catch (error) {
      console.error('Error fetching freezones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFreezones = freezones.filter(freezone => {
    const matchesSearch = freezone.freezone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freezone.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmirate = !selectedEmirate || 
                          freezone.office_location?.toLowerCase().includes(selectedEmirate.toLowerCase());
    return matchesSearch && matchesEmirate;
  });

  const filteredMainland = mainlandOptions.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmirate = !selectedEmirate || option.location === selectedEmirate;
    return matchesSearch && matchesEmirate;
  });

  const handleSelection = (name: string) => {
    onSelectFreezone(name, businessType as 'freezone' | 'mainland');
  };

  return (
    <div className="space-y-6">
      {/* Business Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Business Setup Type</CardTitle>
          <CardDescription>
            Select whether you want to establish in a Free Zone or Mainland
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={businessType === 'freezone' ? 'default' : 'outline'}
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => setBusinessType('freezone')}
            >
              <Building2 className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Free Zone</div>
                <div className="text-xs text-muted-foreground">
                  100% ownership, tax benefits, easy setup
                </div>
              </div>
            </Button>
            
            <Button
              variant={businessType === 'mainland' ? 'default' : 'outline'}
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => setBusinessType('mainland')}
            >
              <MapPin className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Mainland</div>
                <div className="text-xs text-muted-foreground">
                  UAE market access, local sponsorship
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      {businessType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${businessType === 'freezone' ? 'free zones' : 'mainland options'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Emirate</label>
                <Select value={selectedEmirate} onValueChange={setSelectedEmirate}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Emirates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Emirates</SelectItem>
                    {emirates.map(emirate => (
                      <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Business Activity</label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Activities</SelectItem>
                    {activityTypes.map(activity => (
                      <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Options List */}
      {businessType === 'freezone' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Free Zones</h3>
          {loading ? (
            <div className="text-center py-8">Loading free zones...</div>
          ) : (
            <div className="grid gap-4">
              {filteredFreezones.map((freezone) => (
                <Card 
                  key={freezone.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFreezone === freezone.freezone_name ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelection(freezone.freezone_name)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{freezone.freezone_name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {freezone.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {freezone.office_location}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {freezone.key_benefits?.slice(0, 3).map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {businessType === 'mainland' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mainland Options</h3>
          <div className="grid gap-4">
            {filteredMainland.map((option) => (
              <Card 
                key={option.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFreezone === option.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelection(option.name)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{option.name}</h4>
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {option.location}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">UAE Market Access</Badge>
                        <Badge variant="secondary" className="text-xs">Local Partnership</Badge>
                        <Badge variant="secondary" className="text-xs">Government Contracts</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreezoneSelectionStep;