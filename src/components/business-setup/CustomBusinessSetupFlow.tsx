import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import BusinessActivityStep from './BusinessActivityStep';
import ShareholdersStep from './ShareholdersStep';
import VisaRequirementsStep from './VisaRequirementsStep';
import TenureStep from './TenureStep';
import ZoneSelectionStep from './ZoneSelectionStep';
import PackageSelectionStep from './PackageSelectionStep';
import SummaryStep from './SummaryStep';

import { BusinessSetupState } from '@/types/businessSetup';
import { businessActivities } from '@/data/businessSetupData';

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  type: 'mainland' | 'freezone';
  description: string;
  location: string;
  key_benefits: string[];
  contact_info: any;
  is_active: boolean;
}

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

const steps = [
  { number: 1, title: 'Activities', description: 'Select business activities' },
  { number: 2, title: 'Shareholders', description: 'Number of shareholders' },
  { number: 3, title: 'Visas', description: 'Visa requirements' },
  { number: 4, title: 'Tenure', description: 'License duration' },
  { number: 5, title: 'Zone', description: 'Choose location' },
  { number: 6, title: 'Package', description: 'Select package' },
  { number: 7, title: 'Summary', description: 'Review & confirm' },
];

const CustomBusinessSetupFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  const [state, setState] = useState<BusinessSetupState>({
    selectedActivities: [],
    shareholders: 1,
    totalVisas: 0,
    tenure: 1,
    entityType: "",
    estimatedCost: 0,
    costBreakdown: null,
    recommendedPackage: null,
    alternativePackages: [],
    isFreezone: true,
    searchTerm: "",
    filteredActivities: businessActivities
  });

  const updateState = (updates: Partial<BusinessSetupState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return state.selectedActivities.length > 0 && state.selectedActivities.length <= 10;
      case 2:
        return state.shareholders > 0 && state.shareholders <= 10;
      case 3:
        return state.totalVisas >= 0 && state.totalVisas <= 20;
      case 4:
        return state.tenure > 0;
      case 5:
        return selectedZone !== null;
      case 6:
        return selectedPackage !== null;
      case 7:
        return true;
      default:
        return true;
    }
  };

  const getRequirements = () => ({
    activities: state.selectedActivities.length,
    shareholders: state.shareholders,
    visas: state.totalVisas,
    tenure: state.tenure,
  });

  const handleComplete = async () => {
    try {
      // Here you would save the complete setup to database
      toast({
        title: "Setup Complete!",
        description: "Your business setup configuration has been saved successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      state,
      setState: updateState,
      onNext: nextStep,
      onBack: prevStep
    };

    switch (currentStep) {
      case 1:
        return <BusinessActivityStep {...stepProps} />;
      case 2:
        return <ShareholdersStep {...stepProps} />;
      case 3:
        return <VisaRequirementsStep {...stepProps} />;
      case 4:
        return <TenureStep {...stepProps} />;
      case 5:
        return (
          <ZoneSelectionStep
            selectedZone={selectedZone}
            onSelectZone={(zone: Zone) => setSelectedZone(zone)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return selectedZone ? (
          <PackageSelectionStep
            selectedFreezone={selectedZone.name}
            selectedType={selectedZone.type}
            onSelectPackage={setSelectedPackage}
            selectedPackage={selectedPackage}
          />
        ) : null;
      case 7:
        return (
          <SummaryStep
            {...stepProps}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Custom Business Setup</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isAccessible = step.number <= currentStep;
            
            return (
              <div 
                key={step.number} 
                className={`flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                  isActive 
                    ? 'text-primary scale-110' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : isAccessible 
                        ? 'text-muted-foreground hover:text-primary/70' 
                        : 'text-muted-foreground/50'
                }`}
                onClick={() => isAccessible && setCurrentStep(step.number)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : isCompleted 
                      ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                      : isAccessible 
                        ? 'bg-muted hover:bg-primary/10' 
                        : 'bg-muted/50'
                }`}>
                  {isCompleted ? '✓' : step.number}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Step {currentStep} of 7</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < 7 ? (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()} 
              className="flex-1"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex-1">
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomBusinessSetupFlow;