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
import LegalEntityStep from "@/components/business-setup/LegalEntityStep";
import CostEstimationStep from "@/components/business-setup/CostEstimationStep";
import SummaryStep from "@/components/business-setup/SummaryStep";

const BusinessSetupFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [state, setState] = useState<BusinessSetupState>({
    selectedActivities: [],
    shareholders: 1,
    investorVisas: 0,
    employeeVisas: 0,
    entityType: "",
    estimatedCost: 0,
    costBreakdown: null,
    isFreezone: false,
    searchTerm: "",
    filteredActivities: businessActivities
  });

  const { getActivityCosts, getEntityCost, getShareholderFee, getVisaFee, isLoading, calculateFreezoneTotal } = useBusinessCosts();

  // Filter activities based on search term
  useEffect(() => {
    if (state.searchTerm.trim() === "") {
      setState(prev => ({ ...prev, filteredActivities: businessActivities }));
    } else {
      const filtered: {[key: string]: string[]} = {};
      Object.entries(businessActivities).forEach(([category, activities]) => {
        const matchingActivities = activities.filter(activity =>
          activity.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        if (matchingActivities.length > 0) {
          filtered[category] = matchingActivities;
        }
      });
      setState(prev => ({ ...prev, filteredActivities: filtered }));
    }
  }, [state.searchTerm]);

  const calculateCost = () => {
    // Determine if it's a freezone entity
    const isFreezoneBusiness = state.entityType === "fzc" || state.entityType === "branch";
    const totalVisas = state.investorVisas + state.employeeVisas;
    
    if (isFreezoneBusiness) {
      // Use new freezone cost calculation
      const { totalCost, breakdown } = calculateFreezoneTotal(
        state.selectedActivities, 
        state.entityType, 
        state.shareholders, 
        totalVisas
      );
      
      setState(prev => ({
        ...prev,
        estimatedCost: totalCost,
        costBreakdown: breakdown,
        isFreezone: true
      }));
    } else {
      // Use legacy mainland cost calculation
      const activityCosts = getActivityCosts(state.selectedActivities, false);
      const totalLicenseFee = activityCosts.reduce((sum, item) => sum + item.fee, 0);
      
      const legalEntityFee = getEntityCost(state.entityType, false);
      const shareholderFee = getShareholderFee() * Math.max(0, state.shareholders - 1);
      const visaFee = getVisaFee() * totalVisas;
      
      const totalCost = totalLicenseFee + legalEntityFee + shareholderFee + visaFee;
      
      const breakdown = {
        activities: activityCosts,
        totalLicenseFee,
        legalEntityFee,
        shareholderFee,
        visaFee,
        shareholders: state.shareholders - 1,
        visaCount: totalVisas,
        entityType: state.entityType,
        isFreezone: false
      };
      
      setState(prev => ({
        ...prev,
        estimatedCost: totalCost,
        costBreakdown: breakdown,
        isFreezone: false
      }));
    }
  };

  // Save selections to user profile
  const saveToProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectionData = {
        selectedActivities: state.selectedActivities,
        shareholders: state.shareholders,
        investorVisas: state.investorVisas,
        employeeVisas: state.employeeVisas,
        entityType: state.entityType,
        estimatedCost: state.estimatedCost,
        timestamp: new Date().toISOString()
      };

      // Store in localStorage as a fallback and for immediate use
      localStorage.setItem('businessSetupSelections', JSON.stringify(selectionData));
      
      toast({
        title: "Selections Saved",
        description: "Your business setup preferences have been saved.",
      });
    } catch (error) {
      console.error('Error saving to profile:', error);
    }
  };

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (state.selectedActivities.length > 0 && state.entityType && currentStep === 5) {
      calculateCost();
    }
  }, [state.selectedActivities, state.shareholders, state.investorVisas, state.employeeVisas, state.entityType, currentStep]);

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 4) {
        calculateCost();
      }
      if (currentStep === 5) {
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
      case 1: return state.selectedActivities.length > 0;
      case 2: return state.shareholders > 0;
      case 3: return state.investorVisas >= 0 && state.employeeVisas >= 0;
      case 4: return state.entityType !== "";
      case 5: return state.estimatedCost > 0;
      default: return true;
    }
  };

  const updateState = (updates: Partial<BusinessSetupState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    const stepProps = {
      state,
      setState: updateState,
      onNext: nextStep,
      onBack: prevStep
    };

    switch (currentStep) {
      case 1: return <BusinessActivityStep {...stepProps} />;
      case 2: return <ShareholdersStep {...stepProps} />;
      case 3: return <VisaRequirementsStep {...stepProps} />;
      case 4: return <LegalEntityStep {...stepProps} />;
      case 5: return <CostEstimationStep {...stepProps} />;
      case 6: return <SummaryStep {...stepProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
          {businessSetupSteps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center space-y-1 ${
                step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.number <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
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
          
          {currentStep < 6 ? (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              className="flex-1"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/")} className="flex-1">
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessSetupFlow;