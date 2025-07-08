import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface BusinessCost {
  id: number;
  mainland_fee: number | null;
  freezone_fee: number | null;
  extra_fee: number | null;
  category: string;
  item_name: string | null;
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
          fee: isFreezone ? cost?.freezone_fee || 0 : cost?.mainland_fee || 0
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
    
    return isFreezone ? cost?.freezone_fee || 0 : cost?.mainland_fee || 0;
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
    
    return cost?.mainland_fee || 2000; // fallback to 2000 AED per visa
  };

  return {
    costs,
    isLoading,
    getActivityCosts,
    getEntityCost,
    getShareholderFee,
    getVisaFee
  };
};