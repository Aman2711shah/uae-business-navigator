import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { businessActivities, businessSetupSteps } from "@/data/businessSetupData";
import { BusinessSetupState } from "@/types/businessSetup";
import BusinessActivityStep from "@/components/business-setup/BusinessActivityStep";
import ShareholdersStep from "@/components/business-setup/ShareholdersStep";
import VisaRequirementsStep from "@/components/business-setup/VisaRequirementsStep";
import TenureStep from "@/components/business-setup/TenureStep";
import LegalEntityStep from "@/components/business-setup/LegalEntityStep";
import CostEstimationStep from "@/components/business-setup/CostEstimationStep";
import SummaryStep from "@/components/business-setup/SummaryStep";
const BusinessSetupFlow = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
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
  const {
    getActivityCosts,
    getEntityCost,
    getShareholderFee,
    getVisaFee,
    isLoading,
    calculateFreezoneTotal
  } = useBusinessCosts();

  // Filter activities based on search term
  useEffect(() => {
    if (state.searchTerm.trim() === "") {
      setState(prev => ({
        ...prev,
        filteredActivities: businessActivities
      }));
    } else {
      const filtered: {
        [key: string]: string[];
      } = {};
      Object.entries(businessActivities).forEach(([category, activities]) => {
        const matchingActivities = activities.filter(activity => activity.toLowerCase().includes(state.searchTerm.toLowerCase()));
        if (matchingActivities.length > 0) {
          filtered[category] = matchingActivities;
        }
      });
      setState(prev => ({
        ...prev,
        filteredActivities: filtered
      }));
    }
  }, [state.searchTerm]);
  const calculateCost = async () => {
    try {
      // Fetch packages from Supabase
      const { data: packages, error } = await supabase
        .from('packages')
        .select('*')
        .gte('max_visas', state.totalVisas)
        .gte('shareholders_allowed', state.shareholders)
        .gte('activities_allowed', state.selectedActivities.length)
        .eq('tenure_years', state.tenure);

      if (error) throw error;

      if (packages && packages.length > 0) {
        // Calculate actual costs for each package
        const calculatedPackages = packages.map(pkg => {
          const baseCost = pkg.base_cost;
          const visaCost = state.totalVisas * (pkg.per_visa_cost || 0);
          const totalCost = baseCost + visaCost;
          
          return {
            ...pkg,
            calculatedCost: totalCost
          };
        });

        // Sort by price and get recommended + alternatives
        calculatedPackages.sort((a, b) => a.calculatedCost - b.calculatedCost);
        const recommended = calculatedPackages[0];
        const alternatives = calculatedPackages.slice(1, 3);

        setState(prev => ({
          ...prev,
          estimatedCost: recommended.calculatedCost,
          recommendedPackage: recommended,
          alternativePackages: alternatives,
          costBreakdown: {
            packageName: recommended.package_name,
            freezoneName: recommended.freezone_name,
            baseCost: recommended.base_cost,
            visaCost: state.totalVisas * (recommended.per_visa_cost || 0),
            totalCost: recommended.calculatedCost,
            includedServices: recommended.included_services,
            isFreezone: true
          },
          isFreezone: true
        }));
      } else {
        // Fallback to legacy calculation if no packages found
        const activityCosts = getActivityCosts(state.selectedActivities, false);
        const totalLicenseFee = activityCosts.reduce((sum, item) => sum + item.fee, 0);
        const legalEntityFee = getEntityCost(state.entityType, false);
        const shareholderFee = getShareholderFee() * Math.max(0, state.shareholders - 1);
        const visaFee = getVisaFee() * state.totalVisas;
        const totalCost = totalLicenseFee + legalEntityFee + shareholderFee + visaFee;
        
        setState(prev => ({
          ...prev,
          estimatedCost: totalCost,
          costBreakdown: {
            activities: activityCosts,
            totalLicenseFee,
            legalEntityFee,
            shareholderFee,
            visaFee,
            shareholders: state.shareholders - 1,
            visaCount: state.totalVisas,
            entityType: state.entityType,
            isFreezone: false
          },
          isFreezone: false
        }));
      }
    } catch (error) {
      console.error('Error calculating costs:', error);
    }
  };

  // Save selections to user profile
  const saveToProfile = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const selectionData = {
        selectedActivities: state.selectedActivities,
        shareholders: state.shareholders,
        totalVisas: state.totalVisas,
        tenure: state.tenure,
        entityType: state.entityType,
        estimatedCost: state.estimatedCost,
        recommendedPackage: state.recommendedPackage,
        timestamp: new Date().toISOString()
      };

      // Store in localStorage as a fallback and for immediate use
      localStorage.setItem('businessSetupSelections', JSON.stringify(selectionData));
      toast({
        title: "Selections Saved",
        description: "Your business setup preferences have been saved."
      });
    } catch (error) {
      console.error('Error saving to profile:', error);
    }
  };

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (state.selectedActivities.length > 0 && currentStep === 6) {
      calculateCost();
    }
  }, [state.selectedActivities, state.shareholders, state.totalVisas, state.tenure, currentStep]);
  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 5) {
        calculateCost();
      }
      if (currentStep === 6) {
        saveToProfile();
      }
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
        return state.selectedActivities.length > 0 && state.selectedActivities.length <= 5;
      case 2:
        return state.shareholders > 0 && state.shareholders <= 5;
      case 3:
        return state.totalVisas >= 0 && state.totalVisas <= 5;
      case 4:
        return state.tenure > 0;
      case 5:
        return state.entityType !== "";
      case 6:
        return state.estimatedCost > 0;
      default:
        return true;
    }
  };
  const updateState = (updates: Partial<BusinessSetupState>) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
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
        return <LegalEntityStep {...stepProps} />;
      case 6:
        return <CostEstimationStep {...stepProps} />;
      case 7:
        return <SummaryStep {...stepProps} />;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Company Setup</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-2">
          {businessSetupSteps.map(step => <div key={step.number} className={`flex flex-col items-center space-y-1 ${step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              <step.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{step.title}</span>
            </div>)}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${currentStep / 7 * 100}%`
        }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          {currentStep > 1 && <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>}
          
          {currentStep < 7 ? <Button onClick={nextStep} disabled={!canProceed()} className="flex-1">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button> : <Button onClick={() => navigate("/")} className="flex-1">
              Complete Setup
            </Button>}
        </div>
      </div>
    </div>;
};
export default BusinessSetupFlow;