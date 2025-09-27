import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Clock, FileText, Building, Users, CreditCard } from "lucide-react";
import { StepProps } from "@/types/businessSetup";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { useBusinessCosts } from "@/hooks/useBusinessCosts";

const EnhancedCostEstimationStep: React.FC<StepProps> = ({ state, setState }) => {
  const { businessCategories } = useGoogleSheetsData();
  const { calculateFreezoneTotal, getFreezoneOptions } = useBusinessCosts();

  useEffect(() => {
    // Use activities for cost calculation if available, otherwise fall back to services
    const activitiesOrServices = state.selectedActivities?.length > 0 
      ? state.selectedActivities 
      : state.selectedServices || [];
    
    if (activitiesOrServices.length > 0 && state.shareholders > 0 && state.entityType) {
      // Use the updated cost calculation that respects activity limits
      const result = calculateFreezoneTotal(
        activitiesOrServices,
        state.entityType,
        state.shareholders,
        state.totalVisas || 0
      );
      
      if (result.error) {
        const breakdown = {
          basePrice: 0,
          visaCosts: 0,
          serviceCosts: 0,
          additionalCosts: 0,
          totalPrice: 0,
          estimatedTimeline: "N/A",
          breakdown: {
            freezonePackage: {
              id: 'none',
              name: 'No Eligible Package',
              activities: activitiesOrServices.length,
              shareholders: state.shareholders,
              tenure: state.tenure,
              entityType: state.entityType,
              basePrice: 0,
              visaPrice: 0,
              additionalFees: {}
            },
            selectedServices: [],
            selectedVisas: state.selectedVisaTypes || [],
            additionalFees: {}
          },
          error: result.error
        };
        
        setState({
          estimatedCost: 0,
          costBreakdown: breakdown
        });
        return;
      }

      const selectedCategory = businessCategories.find(cat => cat.id === state.selectedCategory);
      const selectedServiceDetails = selectedCategory?.services.filter(service => 
        activitiesOrServices.includes(service.id)
      ) || [];

      const breakdown = {
        basePrice: result.breakdown?.baseLicenseFee || 0,
        visaCosts: result.breakdown?.visaFee || 0,
        serviceCosts: result.breakdown?.activityExtraCost || 0,
        additionalCosts: result.breakdown?.shareholderFee || 0,
        totalPrice: result.totalCost,
        estimatedTimeline: "30-45 days",
        breakdown: {
          freezonePackage: {
            id: 'freezone',
            name: result.breakdown?.freezoneName || 'Freezone Package',
            activities: activitiesOrServices.length,
            shareholders: state.shareholders,
            tenure: state.tenure,
            entityType: state.entityType,
            basePrice: result.breakdown?.baseLicenseFee || 0,
            visaPrice: result.breakdown?.visaFee || 0,
            additionalFees: {},
            packageActivityLimit: result.breakdown?.packageActivityLimit,
            isWithinLimit: result.breakdown?.isWithinLimit
          },
          selectedServices: activitiesOrServices.map((activity, index) => ({
            id: activity,
            name: activity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: 'business',
            description: index < (result.breakdown?.packageActivityLimit || 0) 
              ? "Included in package" 
              : "Additional activity (extra cost)",
            timeline: "7-14 days",
            standardPrice: result.breakdown?.activities[index]?.fee || 0,
            premiumPrice: (result.breakdown?.activities[index]?.fee || 0) * 1.5,
            documentRequirements: ['Business License'],
            isRequired: index === 0,
            isExtra: index >= (result.breakdown?.packageActivityLimit || 0)
          })),
          selectedVisas: state.selectedVisaTypes || [],
          additionalFees: {
            'Shareholder Fees': result.breakdown?.shareholderFee || 0,
            ...(result.breakdown?.activityExtraCost ? { 'Extra Activities': result.breakdown.activityExtraCost } : {})
          },
          eligiblePackages: result.eligiblePackages
        }
      };

      setState({
        estimatedCost: result.totalCost,
        costBreakdown: breakdown
      });
    }
  }, [state.selectedActivities, state.selectedServices, state.shareholders, state.totalVisas, state.tenure, state.entityType, businessCategories, calculateFreezoneTotal, setState]);

  if (!state.costBreakdown) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation</h2>
          <p className="text-muted-foreground">Please complete all previous steps to see pricing</p>
        </div>
      </div>
    );
  }

  const { costBreakdown } = state;

  // Show error if no eligible packages
  if (costBreakdown.error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Package Eligibility Issue</h2>
          <p className="text-destructive">{costBreakdown.error}</p>
          <p className="text-muted-foreground mt-2">
            Please reduce the number of selected activities or choose a different package type.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Cost Estimation & Breakdown</h2>
        <p className="text-muted-foreground">Complete breakdown of your business setup costs</p>
      </div>

      {/* Total Cost Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-8 h-8 text-primary mr-2" />
            <span className="text-3xl font-bold text-foreground">
              AED {costBreakdown.totalPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-muted-foreground">Total Estimated Cost</p>
          <div className="flex items-center justify-center mt-2">
            <Clock className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground">
              Estimated Timeline: {costBreakdown.estimatedTimeline}
            </span>
          </div>
        </div>
      </Card>

      {/* Cost Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Cost Breakdown
        </h3>
        
        <div className="space-y-4">
          {/* Base Package Cost */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building className="w-4 h-4 text-muted-foreground mr-2" />
              <span className="font-medium">Base Package ({state.entityType})</span>
            </div>
            <span className="font-semibold">AED {costBreakdown.basePrice.toLocaleString()}</span>
          </div>

          {/* Service Costs */}
          {costBreakdown.serviceCosts > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="font-medium">Selected Services</span>
              </div>
              <span className="font-semibold">AED {costBreakdown.serviceCosts.toLocaleString()}</span>
            </div>
          )}

          {/* Visa Costs */}
          {costBreakdown.visaCosts > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="font-medium">Visa Costs ({state.totalVisas} visas)</span>
              </div>
              <span className="font-semibold">AED {costBreakdown.visaCosts.toLocaleString()}</span>
            </div>
          )}

          {/* Additional Costs */}
          {costBreakdown.additionalCosts > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="font-medium">Additional Fees</span>
              </div>
              <span className="font-semibold">AED {costBreakdown.additionalCosts.toLocaleString()}</span>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Cost</span>
            <span className="text-primary">AED {costBreakdown.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Selected Activities/Services Details */}
      {costBreakdown.breakdown.selectedServices.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            Selected Activities
            {costBreakdown.breakdown.freezonePackage.packageActivityLimit && (
              <Badge variant="outline" className="ml-2 text-xs">
                Package limit: {costBreakdown.breakdown.freezonePackage.packageActivityLimit} activities
              </Badge>
            )}
          </h3>
          <div className="space-y-3">
            {costBreakdown.breakdown.selectedServices.map((service, index) => (
              <div key={service.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-foreground flex items-center">
                    {service.name}
                    {service.isExtra && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Extra
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {service.timeline}
                  </Badge>
                </div>
                <span className="font-semibold text-right">
                  AED {service.standardPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          
          {!costBreakdown.breakdown.freezonePackage.isWithinLimit && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                ⚠️ You have selected more activities than your package supports. Additional activities will incur extra costs.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Selected Visas Details */}
      {state.selectedVisaTypes && state.selectedVisaTypes.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Selected Visas</h3>
          <div className="space-y-3">
            {state.selectedVisaTypes.map((visa, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{visa.name}</p>
                  <p className="text-sm text-muted-foreground">{visa.description}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {visa.processingTime}
                  </Badge>
                </div>
                <span className="font-semibold text-right">
                  AED {visa.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Package Summary */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          📋 Package Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Business Category</p>
            <p className="text-blue-800 dark:text-blue-200 capitalize">{state.selectedCategory}</p>
          </div>
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Entity Type</p>
            <p className="text-blue-800 dark:text-blue-200 capitalize">{state.entityType}</p>
          </div>
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Shareholders</p>
            <p className="text-blue-800 dark:text-blue-200">{state.shareholders}</p>
          </div>
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">License Tenure</p>
            <p className="text-blue-800 dark:text-blue-200">{state.tenure} Year{state.tenure !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedCostEstimationStep;