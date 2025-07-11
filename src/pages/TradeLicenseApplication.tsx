import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Award, DollarSign, Building2, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FreezonePackage {
  id: number;
  freezone_name: string;
  package_name: string;
  package_type: string;
  max_visas: number;
  shareholders_allowed: number;
  activities_allowed: number;
  tenure_years: number;
  price_aed: number;
  base_cost: number;
  per_visa_cost: number | null;
  included_services: string | null;
}

const TradeLicenseApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState<FreezonePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<FreezonePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [packages, searchTerm, filterType, sortBy]);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('price_aed', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load freezone packages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = packages.filter(pkg => 
      pkg.freezone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== "all") {
      filtered = filtered.filter(pkg => pkg.package_type.toLowerCase() === filterType.toLowerCase());
    }

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price_aed - b.price_aed;
        case "name":
          return a.freezone_name.localeCompare(b.freezone_name);
        case "visas":
          return b.max_visas - a.max_visas;
        default:
          return 0;
      }
    });

    setFilteredPackages(filtered);
  };

  const getFreezoneSpecialty = (freezoneName: string) => {
    const specialties: Record<string, string> = {
      "SHAMS": "Media & Creative Industries",
      "Launch Zone": "E-commerce & Startups", 
      "Meydan": "Business & Trading",
      "RAKEZ": "Manufacturing & Trading",
      "ADGM": "Financial Services",
      "twofour54": "Media & Entertainment",
      "KIZAD": "Industrial & Manufacturing",
      "ADAFZ": "Logistics & Aviation",
      "Masdar City": "Clean Energy & Sustainability",
      "SAIF Zone": "Aviation & Logistics",
      "SRTIP": "Technology & Innovation",
      "SHCC": "Healthcare & Medical",
      "SPC": "Publishing & Media",
      "SHRD": "Human Resources & Training",
      "STIP": "Technology & Innovation",
      "AFZ": "General Trading",
      "FFZ": "Trading & Logistics",
      "FOIZ": "Oil & Energy",
      "RAK FTZ": "Free Trade & Commerce",
      "RAKMC": "Media & Creative",
      "UAQFTZ": "Trading & Manufacturing"
    };
    return specialties[freezoneName] || "General Business";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPackageTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Standard": "bg-blue-100 text-blue-800",
      "Media": "bg-purple-100 text-purple-800",
      "Starter": "bg-green-100 text-green-800",
      "Professional": "bg-orange-100 text-orange-800",
      "FZ-LLC": "bg-indigo-100 text-indigo-800",
      "Branch": "bg-gray-100 text-gray-800",
      "Serviced Office": "bg-pink-100 text-pink-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading freezone packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Apply for Trade License</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white border-b">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search freezones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fz-llc">FZ-LLC</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="name">Freezone Name</SelectItem>
                <SelectItem value="visas">Max Visas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Found {filteredPackages.length} freezone packages
        </p>

        {/* Package Cards */}
        <div className="space-y-4">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="border border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {pkg.freezone_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {getFreezoneSpecialty(pkg.freezone_name)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(pkg.price_aed)}
                    </div>
                    <div className="text-sm text-muted-foreground">Starting from</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPackageTypeColor(pkg.package_type)}>
                      {pkg.package_type}
                    </Badge>
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      Up to {pkg.max_visas} Visas
                    </Badge>
                    <Badge variant="outline">
                      Up to {pkg.shareholders_allowed} Shareholders
                    </Badge>
                    <Badge variant="outline">
                      {pkg.activities_allowed} Activities
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Package: {pkg.package_name}</h4>
                    {pkg.included_services && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Included:</strong> {pkg.included_services}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Base Cost:</span>
                      <div className="font-medium">{formatPrice(pkg.base_cost)}</div>
                    </div>
                    {pkg.per_visa_cost && (
                      <div>
                        <span className="text-muted-foreground">Per Visa:</span>
                        <div className="font-medium">{formatPrice(pkg.per_visa_cost)}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => navigate(`/business-setup?freezone=${pkg.freezone_name}`)}
                    >
                      Start Application
                    </Button>
                    <Button variant="outline" size="sm">
                      Compare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No packages found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeLicenseApplication;