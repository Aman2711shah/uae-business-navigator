import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  description: string;
  location: string;
  key_benefits: string[];
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

interface BusinessActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  activity_code: string;
  license_requirements: string[];
  minimum_capital: number;
}

export const useCustomPackages = () => {
  const { data: zones, isLoading: isLoadingZones } = useQuery({
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

  const { data: packages, isLoading: isLoadingPackages } = useQuery({
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
            location,
            key_benefits
          )
        `)
        .eq("is_active", true)
        .order("base_price");
      
      if (error) throw error;
      return data as CustomPackage[];
    }
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["business-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_activities")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data as BusinessActivity[];
    }
  });

  const getPackagesByZone = (zoneId: string) => {
    return packages?.filter(pkg => pkg.zone_id === zoneId) || [];
  };

  const getMainlandZones = () => {
    return zones?.filter(zone => zone.zone_type === 'mainland') || [];
  };

  const getFreezoneZones = () => {
    return zones?.filter(zone => zone.zone_type === 'freezone') || [];
  };

  const getActivitiesByCategory = () => {
    const groupedActivities: { [key: string]: BusinessActivity[] } = {};
    
    activities?.forEach(activity => {
      const category = activity.category || 'Other';
      if (!groupedActivities[category]) {
        groupedActivities[category] = [];
      }
      groupedActivities[category].push(activity);
    });

    return groupedActivities;
  };

  const calculatePackagePrice = (
    packageData: CustomPackage,
    selectedActivities: number,
    shareholders: number,
    visas: number,
    tenure: number
  ) => {
    let totalPrice = packageData.base_price;

    // Add per-activity cost (if exceeding included amount)
    if (selectedActivities > packageData.max_activities) {
      totalPrice += (selectedActivities - packageData.max_activities) * (packageData.per_activity_price || 0);
    }

    // Add per-shareholder cost (if exceeding included amount)
    if (shareholders > packageData.max_shareholders) {
      totalPrice += (shareholders - packageData.max_shareholders) * (packageData.per_shareholder_price || 0);
    }

    // Add per-visa cost (if exceeding included amount)
    if (visas > packageData.max_visas) {
      totalPrice += (visas - packageData.max_visas) * (packageData.per_visa_price || 0);
    }

    // Apply tenure multiplier if not 1 year
    if (tenure > 1 && packageData.tenure_years.includes(tenure)) {
      totalPrice *= tenure;
    }

    return totalPrice;
  };

  const findBestPackage = (
    selectedActivities: string[],
    shareholders: number,
    visas: number,
    tenure: number,
    preferredZoneType?: 'mainland' | 'freezone'
  ) => {
    if (!packages) return null;

    let filteredPackages = packages;

    // Filter by zone type if specified
    if (preferredZoneType) {
      filteredPackages = packages.filter(pkg => pkg.zones?.zone_type === preferredZoneType);
    }

    // Find packages that can accommodate the requirements
    const suitablePackages = filteredPackages.filter(pkg => 
      pkg.max_activities >= selectedActivities.length &&
      pkg.max_shareholders >= shareholders &&
      pkg.max_visas >= visas &&
      pkg.tenure_years.includes(tenure)
    );

    if (suitablePackages.length === 0) return null;

    // Calculate prices and find the best value
    const packagesWithPrices = suitablePackages.map(pkg => ({
      package: pkg,
      totalPrice: calculatePackagePrice(pkg, selectedActivities.length, shareholders, visas, tenure)
    }));

    // Sort by price and return the cheapest
    packagesWithPrices.sort((a, b) => a.totalPrice - b.totalPrice);
    
    return {
      package: packagesWithPrices[0].package,
      totalPrice: packagesWithPrices[0].totalPrice,
      alternatives: packagesWithPrices.slice(1, 4) // Show up to 3 alternatives
    };
  };

  return {
    zones,
    packages,
    activities,
    isLoading: isLoadingZones || isLoadingPackages || isLoadingActivities,
    getPackagesByZone,
    getMainlandZones,
    getFreezoneZones,
    getActivitiesByCategory,
    calculatePackagePrice,
    findBestPackage
  };
};