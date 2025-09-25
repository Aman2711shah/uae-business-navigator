export interface BusinessSetupStep {
  number: number;
  title: string;
  icon: any;
}

export interface LegalEntityType {
  value: string;
  label: string;
  description: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  services: BusinessService[];
}

export interface BusinessService {
  id: string;
  name: string;
  category: string;
  standardPrice: number;
  premiumPrice: number;
  timeline: string;
  description: string;
  documentRequirements: string[];
  isRequired: boolean;
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  price: number;
  processingTime: string;
}

export interface FreezonePackageData {
  id: string;
  name: string;
  activities: number;
  shareholders: number;
  tenure: number;
  entityType: string;
  basePrice: number;
  visaPrice: number;
  additionalFees: Record<string, number>;
}

export interface PricingBreakdown {
  basePrice: number;
  visaCosts: number;
  serviceCosts: number;
  additionalCosts: number;
  totalPrice: number;
  estimatedTimeline: string;
  breakdown: {
    freezonePackage: FreezonePackageData;
    selectedServices: BusinessService[];
    selectedVisas: VisaType[];
    additionalFees: Record<string, number>;
  };
}

export interface BusinessSetupState {
  // Step 1: Business Category
  selectedCategory: string;
  availableServices: BusinessService[];
  
  // Step 2: Services Selection
  selectedServices: string[];
  
  // Step 3: Shareholders
  shareholders: number;
  
  // Step 4: Visas
  totalVisas: number;
  selectedVisaTypes: VisaType[];
  
  // Step 5: License Tenure
  tenure: number;
  
  // Step 6: Entity Type
  entityType: string;
  
  // Pricing & Results
  estimatedCost: number;
  costBreakdown: PricingBreakdown | null;
  recommendedPackage: FreezonePackageData | null;
  alternativePackages: FreezonePackageData[];
  
  // Legacy fields (to maintain compatibility)
  selectedActivities: string[];
  isFreezone: boolean;
  searchTerm: string;
  filteredActivities: {[key: string]: string[]};
}

export interface FreezonePackage {
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
  per_visa_cost: number;
  included_services: string;
}

export interface StepProps {
  state: BusinessSetupState;
  setState: (updates: Partial<BusinessSetupState>) => void;
  onNext?: () => void;
  onBack?: () => void;
}