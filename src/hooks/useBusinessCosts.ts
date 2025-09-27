import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface BusinessCost {
  id: number;
  License_fee: number | null;
  freezone_fee: number | null;
  extra_fee: number | null;
  category: string;
  item_name: string | null;
}

interface FreezoneCost {
  id: number;
  no_of_activity: number;
  license_type: string;
  minimum_cost: number;
  base_license_cost: number;
  visa_cost: number;
  additional_fee: number;
  freezone_name: string;
}

export const useBusinessCosts = () => {
  const { data: costs, isLoading, refetch } = useQuery({
    queryKey: ["business-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_setup_costs")
        .select("*");
      
      if (error) throw error;
      return data as BusinessCost[];
    },
  });

  const { data: freezoneCosts, isLoading: isLoadingFreezone, refetch: refetchFreezone } = useQuery({
    queryKey: ["freezone-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freezone_costs")
        .select("*");
      
      if (error) throw error;
      return data as FreezoneCost[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('business-costs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_setup_costs'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'freezone_costs'
        },
        () => {
          refetchFreezone();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, refetchFreezone]);

  const getFreezoneOptions = (selectedActivities: string[], entityType: string) => {
    if (!freezoneCosts) return [];
    
    const licenseType = entityType === "fzc" ? "FZ-LLC" : "Branch";
    const activityCount = selectedActivities.length;
    
    return freezoneCosts
      .filter(cost => 
        cost.license_type === licenseType && 
        cost.no_of_activity >= activityCount
      )
      .map(cost => ({
        name: cost.freezone_name,
        licenseType: cost.license_type,
        minimumCost: cost.minimum_cost,
        baseLicenseCost: cost.base_license_cost,
        visaCost: cost.visa_cost,
        additionalFee: cost.additional_fee
      }));
  };

  const calculateFreezoneTotal = (
    selectedActivities: string[], 
    entityType: string, 
    shareholders: number, 
    visas: number,
    selectedFreezone?: string
  ) => {
    if (!freezoneCosts) return { totalCost: 0, breakdown: null };
    
    const licenseType = entityType === "fzc" ? "FZ-LLC" : "Branch";
    const activityCount = selectedActivities.length;
    
    // Find the freezone cost (use first available if no specific freezone selected)
    const freezoneCost = selectedFreezone 
      ? freezoneCosts.find(cost => 
          cost.freezone_name === selectedFreezone && 
          cost.license_type === licenseType &&
          cost.no_of_activity >= activityCount
        )
      : freezoneCosts.find(cost => 
          cost.license_type === licenseType &&
          cost.no_of_activity >= activityCount
        );
    
    if (!freezoneCost) return { totalCost: 0, breakdown: null };
    
    // Calculate costs based on new structure
    const totalLicenseFee = freezoneCost.base_license_cost;
    const legalEntityFee = 0; // Included in base license cost
    const shareholderFee = freezoneCost.additional_fee * Math.max(0, shareholders - 1);
    const visaFee = freezoneCost.visa_cost * visas;
    
    const totalCost = totalLicenseFee + legalEntityFee + shareholderFee + visaFee;
    
    const breakdown = {
      activities: selectedActivities.map(activity => ({
        activity,
        fee: totalLicenseFee / selectedActivities.length // Distribute base cost across activities
      })),
      totalLicenseFee,
      legalEntityFee,
      shareholderFee,
      visaFee,
      shareholders: shareholders - 1,
      visaCount: visas,
      entityType: licenseType,
      isFreezone: true,
      freezoneName: freezoneCost.freezone_name,
      minimumCost: freezoneCost.minimum_cost
    };
    
    return { totalCost, breakdown };
  };

  // Legacy functions for mainland costs (keeping for backward compatibility)
  const getActivityCosts = (activities: string[], isFreezone: boolean = false) => {
    if (!costs) return [];
    
    return activities
      .map(activity => {
        const cost = costs.find(c => 
          c.category === "Business Activities" && 
          c.item_name?.toLowerCase().includes(activity.toLowerCase())
        );
        return {
          activity,
          fee: isFreezone ? cost?.freezone_fee || 0 : cost?.License_fee || 0
        };
      })
      .filter(item => item.fee > 0);
  };

  const getEntityCost = (entityType: string, isFreezone: boolean = false) => {
    if (!costs) return 0;
    
    const entityMap: { [key: string]: string } = {
      sole: "Sole Establishment",
      llc: "Limited Liability Company",
      fzc: "Free Zone Company",
      branch: "Branch Office",
      offshore: "Offshore Company"
    };
    
    const cost = costs.find(c => 
      c.category === "Legal Entity" && 
      c.item_name?.includes(entityMap[entityType])
    );
    
    return isFreezone ? cost?.freezone_fee || 0 : cost?.License_fee || 0;
  };

  const getShareholderFee = () => {
    if (!costs) return 0;
    
    const cost = costs.find(c => 
      c.category === "Additional Services" && 
      c.item_name?.includes("Additional Shareholder")
    );
    
    return cost?.extra_fee || 1000; // fallback to 1000 AED
  };

  const getVisaFee = () => {
    if (!costs) return 0;
    
    const cost = costs.find(c => 
      c.category === "Visa Services" && 
      c.item_name?.includes("Employment Visa")
    );
    
    return cost?.License_fee || 2000; // fallback to 2000 AED per visa
  };

  return {
    costs,
    freezoneCosts,
    isLoading: isLoading || isLoadingFreezone,
    getActivityCosts,
    getEntityCost,
    getShareholderFee,
    getVisaFee,
    getFreezoneOptions,
    calculateFreezoneTotal
  };
};