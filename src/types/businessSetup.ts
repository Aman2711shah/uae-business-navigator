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

export interface BusinessSetupState {
  selectedActivities: string[];
  shareholders: number;
  totalVisas: number;
  tenure: number;
  entityType: string;
  estimatedCost: number;
  costBreakdown: any;
  recommendedPackage: any;
  alternativePackages: any[];
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