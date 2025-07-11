import React, { useState, useEffect } from "react";
import { Award, DollarSign, Users, Calendar, MapPin, CheckCircle, Clock, Globe, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface FreezoneInfo {
  freezone_name: string;
  description: string;
  key_benefits: string[];
  office_location: string;
  website_url: string;
  contact_email: string;
  contact_phone: string;
  faqs: any;
}

interface PackageReviewStepProps {
  selectedFreezone: string;
  selectedType: 'freezone' | 'mainland';
  selectedPackage: Package;
  visaCount: number;
  onUpdateVisaCount: (count: number) => void;
}

const PackageReviewStep: React.FC<PackageReviewStepProps> = ({
  selectedFreezone,
  selectedType,
  selectedPackage,
  visaCount,
  onUpdateVisaCount
}) => {
  const [freezoneInfo, setFreezoneInfo] = useState<FreezoneInfo | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedType === 'freezone') {
      fetchFreezoneInfo();
    }
  }, [selectedFreezone, selectedType]);

  const fetchFreezoneInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('freezone_info')
        .select('*')
        .eq('freezone_name', selectedFreezone)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setFreezoneInfo(data);
    } catch (error) {
      console.error('Error fetching freezone info:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotalCost = () => {
    const baseCost = selectedPackage.base_cost;
    const visaCost = visaCount * (selectedPackage.per_visa_cost || 0);
    return baseCost + visaCost;
  };

  const toggleFaq = (question: string) => {
    setExpandedFaqs(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const getMainlandBenefits = () => [
    "Access to UAE Local Market",
    "Government Contract Eligibility", 
    "Banking & Finance Access",
    "Local Supplier Status",
    "Market Expansion Opportunities"
  ];

  const getEstimatedTimeline = () => {
    if (selectedType === 'freezone') {
      return "3-5 working days";
    }
    return "5-7 working days";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Selection</h2>
        <p className="text-muted-foreground">
          Review the details of your selected package and jurisdiction
        </p>
      </div>

      {/* Package Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Selected Package
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{selectedPackage.package_name}</h3>
              <p className="text-muted-foreground">{selectedFreezone}</p>
              <Badge variant="outline" className="mt-1">{selectedPackage.package_type}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(calculateTotalCost())}
              </div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Cost Breakdown</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Base Package Cost:</span>
                <span>{formatPrice(selectedPackage.base_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Visa Cost ({visaCount} visas):</span>
                <span>{formatPrice(visaCount * (selectedPackage.per_visa_cost || 0))}</span>
              </div>
            </div>
            <div className="border-t pt-2 font-medium flex justify-between">
              <span>Total:</span>
              <span>{formatPrice(calculateTotalCost())}</span>
            </div>
          </div>

          {/* Visa Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Number of Visas</label>
            <select 
              value={visaCount} 
              onChange={(e) => onUpdateVisaCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {Array.from({ length: selectedPackage.max_visas + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? 'visa' : 'visas'}
                  {i > 0 && ` (${formatPrice(i * (selectedPackage.per_visa_cost || 0))})`}
                </option>
              ))}
            </select>
          </div>

          {/* Package Features */}
          <div>
            <h4 className="font-medium mb-2">Package Inclusions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedPackage.included_services?.split(',').map((service, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                  <span>{service.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <strong>Estimated Timeline:</strong> {getEstimatedTimeline()} after document submission
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Jurisdiction Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {selectedType === 'freezone' ? 'Free Zone' : 'Mainland'} Benefits
          </CardTitle>
          <CardDescription>
            Key advantages of {selectedFreezone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedType === 'freezone' && freezoneInfo ? (
            <div className="space-y-4">
              {freezoneInfo.description && (
                <p className="text-sm text-muted-foreground">{freezoneInfo.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {freezoneInfo.key_benefits?.map((benefit, index) => (
                  <Badge key={index} variant="secondary">
                    {benefit}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {freezoneInfo.office_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{freezoneInfo.office_location}</span>
                  </div>
                )}
                {freezoneInfo.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{freezoneInfo.contact_email}</span>
                  </div>
                )}
                {freezoneInfo.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{freezoneInfo.contact_phone}</span>
                  </div>
                )}
                {freezoneInfo.website_url && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={freezoneInfo.website_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {getMainlandBenefits().map((benefit, index) => (
                <Badge key={index} variant="secondary">
                  {benefit}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQs */}
      {selectedType === 'freezone' && freezoneInfo?.faqs && Object.keys(freezoneInfo.faqs).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(freezoneInfo.faqs).map(([question, answer]) => (
                <Collapsible key={question}>
                  <CollapsibleTrigger 
                    className="flex items-center justify-between w-full p-3 text-left bg-muted rounded-lg hover:bg-muted/80"
                    onClick={() => toggleFaq(question)}
                  >
                    <span className="font-medium text-sm">{question}</span>
                    {expandedFaqs.includes(question) ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <p className="text-sm text-muted-foreground">{String(answer)}</p>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageReviewStep;