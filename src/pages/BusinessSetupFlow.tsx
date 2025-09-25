import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { businessActivities, businessSetupSteps } from "@/data/businessSetupData";
import { BusinessSetupState } from "@/types/businessSetup";
import { logger } from "@/lib/logger";
import BusinessCategoryStep from "@/components/business-setup/BusinessCategoryStep";
import ServicesSelectionStep from "@/components/business-setup/ServicesSelectionStep";
import ShareholdersStep from "@/components/business-setup/ShareholdersStep";
import VisaSelectionStep from "@/components/business-setup/VisaSelectionStep";
import TenureStep from "@/components/business-setup/TenureStep";
import LegalEntityStep from "@/components/business-setup/LegalEntityStep";
import EnhancedCostEstimationStep from "@/components/business-setup/EnhancedCostEstimationStep";
import SummaryStep from "@/components/business-setup/SummaryStep";
import SavedQuoteManager from "@/components/business-setup/SavedQuoteManager";
const BusinessSetupFlow = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState<BusinessSetupState>({
    // New flow fields
    selectedCategory: "",
    availableServices: [],
    selectedServices: [],
    selectedVisaTypes: [],
    
    // Core fields
    shareholders: 1,
    totalVisas: 0,
    tenure: 1,
    entityType: "",
    estimatedCost: 0,
    costBreakdown: null,
    recommendedPackage: null,
    alternativePackages: [],
    
    // Legacy fields for compatibility
    selectedActivities: [],
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
  // Legacy cost calculation - kept for compatibility
  const calculateCost = async () => {
    // This function is no longer used with the new enhanced flow
    // Cost calculation is now handled in EnhancedCostEstimationStep
    logger.info('Legacy calculateCost called - using new enhanced pricing');
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (state.selectedActivities.length === 0) return;
    
    setIsSaving(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      const selectionData = {
        selectedCategory: state.selectedCategory,
        selectedServices: state.selectedServices,
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
      
      // Store in user profile if logged in (skip database for now)
      if (user) {
        logger.info('User profile update skipped - business_setup_data field needs migration');
      }
      
      logger.info('Auto-saved business setup selections');
    } catch (error) {
      logger.error('Error auto-saving selections:', error);
    } finally {
      setIsSaving(false);
    }
  }, [state]);

  // Manual save function
  const saveToProfile = async () => {
    setIsSaving(true);
    try {
      await autoSave();
      toast({
        title: "Selections Saved",
        description: "Your business setup preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save selections. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      autoSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSave]);

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (state.selectedServices && state.selectedServices.length > 0 && currentStep === 7) {
      // Cost calculation is handled in EnhancedCostEstimationStep
    }
  }, [state.selectedServices, state.shareholders, state.totalVisas, state.tenure, currentStep]);
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
  const handleHeaderBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      return;
    }
    // Use history when available, otherwise go home
    // @ts-ignore - history state idx is available in React Router v6
    if ((window.history.state && window.history.state.idx > 0) || window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return state.selectedCategory !== "";
      case 2:
        return state.selectedServices && state.selectedServices.length > 0;
      case 3:
        return state.shareholders > 0 && state.shareholders <= 5;
      case 4:
        return state.totalVisas >= 0 && state.totalVisas <= 10;
      case 5:
        return state.tenure > 0;
      case 6:
        return state.entityType !== "";
      case 7:
        return true; // Allow proceeding from cost estimation
      default:
        return true;
    }
  };

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!state.selectedCategory) {
          errors.push('Please select a business category');
        }
        break;
      case 2:
        if (!state.selectedServices || state.selectedServices.length === 0) {
          errors.push('Please select at least one service');
        }
        if (state.selectedServices && state.selectedServices.length > 10) {
          errors.push('Please select no more than 10 services');
        }
        break;
      case 3:
        if (state.shareholders < 1) {
          errors.push('At least one shareholder is required');
        }
        if (state.shareholders > 5) {
          errors.push('Maximum 5 shareholders allowed');
        }
        break;
      case 4:
        if (state.totalVisas < 0) {
          errors.push('Number of visas cannot be negative');
        }
        if (state.totalVisas > 10) {
          errors.push('Maximum 10 visas allowed');
        }
        break;
      case 5:
        if (state.tenure < 1) {
          errors.push('Please select a valid tenure');
        }
        break;
      case 6:
        if (!state.entityType) {
          errors.push('Please select a legal entity type');
        }
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  };
  const updateState = (updates: Partial<BusinessSetupState>) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleLoadQuote = (quoteData: BusinessSetupState) => {
    setState(quoteData);
    // Recalculate cost with loaded data
    setTimeout(() => {
      if (quoteData.selectedActivities.length > 0) {
        calculateCost();
      }
    }, 100);
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
        return <BusinessCategoryStep {...stepProps} />;
      case 2:
        return <ServicesSelectionStep {...stepProps} />;
      case 3:
        return <ShareholdersStep {...stepProps} />;
      case 4:
        return <VisaSelectionStep {...stepProps} />;
      case 5:
        return <TenureStep {...stepProps} />;
      case 6:
        return <LegalEntityStep {...stepProps} />;
      case 7:
        return <EnhancedCostEstimationStep {...stepProps} />;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleHeaderBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Company Setup</h1>
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Save className="h-3 w-3 animate-pulse" />
                Saving...
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={saveToProfile} disabled={isSaving}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator - Enhanced */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-3">
          {businessSetupSteps.map((step, index) => {
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
                <span className="text-xs font-medium text-center">{step.title}</span>
              </div>
            );
          })}
        </div>
        <div className="relative w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
          <div 
            className="absolute top-0 h-2 w-4 bg-white rounded-full shadow-sm transition-all duration-500 ease-out"
            style={{ left: `calc(${(currentStep / 7) * 100}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Step {currentStep} of 7</span>
          <span>{Math.round((currentStep / 7) * 100)}% Complete</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Saved Quote Manager */}
        <div className="mb-6">
          <SavedQuoteManager 
            currentState={state}
            onLoadQuote={handleLoadQuote}
          />
        </div>
        
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          {currentStep > 1 && <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>}
          
          {currentStep < 7 ? <Button 
              onClick={nextStep} 
              disabled={!canProceed() || isLoadingCosts} 
              className="flex-1"
            >
              {isLoadingCosts ? "Loading..." : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button> : <Button onClick={() => navigate("/")} className="flex-1">
              Complete Setup
            </Button>}
        </div>
      </div>
    </div>;
};
export default BusinessSetupFlow;