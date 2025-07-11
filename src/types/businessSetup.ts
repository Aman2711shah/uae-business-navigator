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
  investorVisas: number;
  employeeVisas: number;
  entityType: string;
  estimatedCost: number;
  costBreakdown: any;
  isFreezone: boolean;
  searchTerm: string;
  filteredActivities: {[key: string]: string[]};
}

export interface StepProps {
  state: BusinessSetupState;
  setState: (updates: Partial<BusinessSetupState>) => void;
  onNext?: () => void;
  onBack?: () => void;
}