import React, { useState, useEffect } from "react";
import { DollarSign, Users, Calendar, Award, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: number;
  freezone_name: string;
  package_name: string;
  package_type: string;
  price_aed: number;
  base_cost: number;
  per_visa_cost: number;
  max_visas: number;
  shareholders_allowed: number;
  activities_allowed: number;
  tenure_years: number;
  included_services: string;
}

interface PackageSelectionStepProps {
  selectedFreezone: string;
  selectedType: 'freezone' | 'mainland';
  onSelectPackage: (pkg: Package) => void;
  selectedPackage?: Package;
}

const PackageSelectionStep: React.FC<PackageSelectionStepProps> = ({
  selectedFreezone,
  selectedType,
  onSelectPackage,
  selectedPackage
}) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFreezone && selectedType === 'freezone') {
      fetchPackages();
    } else if (selectedType === 'mainland') {
      // For mainland, we'll show standard packages
      setMainlandPackages();
    }
  }, [selectedFreezone, selectedType]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('freezone_name', selectedFreezone)
        .order('price_aed', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setMainlandPackages = () => {
    // Standard mainland packages
    const mainlandPackages: Package[] = [
      {
        id: 0,
        freezone_name: selectedFreezone,
        package_name: 'Professional License',
        package_type: 'Professional',
        price_aed: 15000,
        base_cost: 12000,
        per_visa_cost: 3000,
        max_visas: 5,
        shareholders_allowed: 5,
        activities_allowed: 3,
        tenure_years: 1,
        included_services: 'License, Initial Approval, Trade Name Reservation, MOA, Emirates ID Assistance'
      },
      {
        id: 1,
        freezone_name: selectedFreezone,
        package_name: 'Commercial License',
        package_type: 'Commercial',
        price_aed: 25000,
        base_cost: 20000,
        per_visa_cost: 5000,
        max_visas: 10,
        shareholders_allowed: 10,
        activities_allowed: 5,
        tenure_years: 1,
        included_services: 'License, Initial Approval, Trade Name, MOA, Office Address, Emirates ID, PRO Services'
      },
      {
        id: 2,
        freezone_name: selectedFreezone,
        package_name: 'Industrial License',
        package_type: 'Industrial',
        price_aed: 35000,
        base_cost: 30000,
        per_visa_cost: 5000,
        max_visas: 15,
        shareholders_allowed: 15,
        activities_allowed: 10,
        tenure_years: 1,
        included_services: 'License, Initial Approval, Environmental Clearance, Trade Name, MOA, Office Setup'
      }
    ];
    setPackages(mainlandPackages);
  };

  const getPackageFeatures = (pkg: Package) => {
    const services = pkg.included_services?.split(',').map(s => s.trim()) || [];
    return services.slice(0, 5); // Show max 5 features
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Your Package</h2>
        <p className="text-muted-foreground">
          Choose the best package for <strong>{selectedFreezone}</strong>
        </p>
      </div>

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
            onClick={() => onSelectPackage(pkg)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pkg.package_name}
                    <Badge variant="outline">{pkg.package_type}</Badge>
                  </CardTitle>
                  <CardDescription>{selectedFreezone}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(pkg.price_aed)}
                  </div>
                  <div className="text-sm text-muted-foreground">Starting from</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Package Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Up to {pkg.max_visas} visas</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{formatPrice(pkg.per_visa_cost || 0)}/visa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.tenure_years} year license</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.activities_allowed} activities</span>
                </div>
              </div>

              {/* Included Services */}
              <div>
                <h4 className="font-medium mb-2">Included Services</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getPackageFeatures(pkg).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <div className="pt-2">
                <Button 
                  className="w-full"
                  variant={selectedPackage?.id === pkg.id ? "default" : "outline"}
                >
                  {selectedPackage?.id === pkg.id ? "Selected" : "Select Package"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No packages available for {selectedFreezone}. Please contact support for custom packages.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageSelectionStep;