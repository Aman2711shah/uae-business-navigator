import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Zone {
  id: string;
  name: string;
  type: 'mainland' | 'freezone';
  description: string;
  location: string;
  key_benefits: string[];
  contact_info: any;
  is_active: boolean;
}

interface ZoneSelectionStepProps {
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
  onNext: () => void;
  onBack: () => void;
}

const ZoneSelectionStep: React.FC<ZoneSelectionStepProps> = ({
  selectedZone,
  onSelectZone,
  onNext,
  onBack
}) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'mainland' | 'freezone'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    filterZones();
  }, [zones, searchTerm, selectedType]);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('is_active', true)
        .order('type, name');

      if (error) throw error;
      setZones((data || []).map(zone => ({ ...zone, type: zone.zone_type as 'mainland' | 'freezone' })));
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast({
        title: "Error",
        description: "Failed to load zones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterZones = () => {
    let filtered = zones;

    if (selectedType !== 'all') {
      filtered = filtered.filter(zone => zone.type === selectedType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(zone =>
        zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredZones(filtered);
  };

  const handleZoneSelect = (zone: Zone) => {
    onSelectZone(zone);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading zones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Setup Location</h2>
        <p className="text-muted-foreground">Select between mainland or freezone setup based on your business needs</p>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search zones by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            size="sm"
          >
            All Zones
          </Button>
          <Button
            variant={selectedType === 'freezone' ? 'default' : 'outline'}
            onClick={() => setSelectedType('freezone')}
            size="sm"
          >
            Freezones
          </Button>
          <Button
            variant={selectedType === 'mainland' ? 'default' : 'outline'}
            onClick={() => setSelectedType('mainland')}
            size="sm"
          >
            Mainland
          </Button>
        </div>
      </div>

      {/* Zone Cards */}
      <div className="grid gap-4">
        {filteredZones.map((zone) => (
          <Card
            key={zone.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedZone?.id === zone.id 
                ? 'ring-2 ring-primary border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleZoneSelect(zone)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {zone.type === 'freezone' ? (
                      <Building className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MapPin className="h-5 w-5 text-green-600" />
                    )}
                    {zone.name}
                    <Badge 
                      variant={zone.type === 'freezone' ? 'default' : 'secondary'}
                      className={zone.type === 'freezone' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                    >
                      {zone.type === 'freezone' ? 'Freezone' : 'Mainland'}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {zone.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{zone.description}</p>
              
              {zone.key_benefits && zone.key_benefits.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                  <div className="flex flex-wrap gap-1">
                    {zone.key_benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {zone.key_benefits.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{zone.key_benefits.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {selectedZone?.id === zone.id && (
                <div className="mt-3 pt-3 border-t">
                  <Button onClick={onNext} className="w-full">
                    Continue with {zone.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredZones.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No zones found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ZoneSelectionStep;