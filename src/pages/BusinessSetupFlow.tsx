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
import BusinessActivityStep from "@/components/business-setup/BusinessActivityStep";
import ShareholdersStep from "@/components/business-setup/ShareholdersStep";
import VisaRequirementsStep from "@/components/business-setup/VisaRequirementsStep";
import TenureStep from "@/components/business-setup/TenureStep";
import LegalEntityStep from "@/components/business-setup/LegalEntityStep";
import CostEstimationStep from "@/components/business-setup/CostEstimationStep";
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
    setIsLoadingCosts(true);
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
      logger.error('Error calculating costs:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate costs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCosts(false);
    }
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
        return true; // Allow proceeding from cost estimation
      default:
        return true;
    }
  };

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (state.selectedActivities.length === 0) {
          errors.push('Please select at least one business activity');
        }
        if (state.selectedActivities.length > 5) {
          errors.push('Please select no more than 5 business activities');
        }
        break;
      case 2:
        if (state.shareholders < 1) {
          errors.push('At least one shareholder is required');
        }
        if (state.shareholders > 5) {
          errors.push('Maximum 5 shareholders allowed');
        }
        break;
      case 3:
        if (state.totalVisas < 0) {
          errors.push('Number of visas cannot be negative');
        }
        if (state.totalVisas > 5) {
          errors.push('Maximum 5 visas allowed');
        }
        break;
      case 4:
        if (state.tenure < 1) {
          errors.push('Please select a valid tenure');
        }
        break;
      case 5:
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