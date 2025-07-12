import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Award, DollarSign, Building2, Search, Upload, CheckCircle, Clock, FileText, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FreezonePackage {
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
  per_visa_cost: number | null;
  included_services: string | null;
}

interface ApplicationData {
  jurisdictionType: 'mainland' | 'freezone' | '';
  selectedZone: string;
  selectedPackage: FreezonePackage | null;
  fullName: string;
  email: string;
  contactNumber: string;
  documents: File[];
}

const TradeLicenseApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<FreezonePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<FreezonePackage[]>([]);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jurisdictionType: '',
    selectedZone: '',
    selectedPackage: null,
    fullName: '',
    email: '',
    contactNumber: '',
    documents: []
  });

  const freeZones = [
    { name: "IFZA", location: "Dubai", specialty: "Business & Trading" },
    { name: "SHAMS", location: "Sharjah", specialty: "Media & Creative Industries" },
    { name: "SPC", location: "Sharjah", specialty: "Publishing & Media" },
    { name: "RAKEZ", location: "Ras Al Khaimah", specialty: "Manufacturing & Trading" },
    { name: "DMCC", location: "Dubai", specialty: "Commodities & Trading" },
    { name: "ADGM", location: "Abu Dhabi", specialty: "Financial Services" },
    { name: "twofour54", location: "Abu Dhabi", specialty: "Media & Entertainment" },
    { name: "KIZAD", location: "Abu Dhabi", specialty: "Industrial & Manufacturing" }
  ];

  const mainlandOptions = [
    { name: "Dubai DED", location: "Dubai", specialty: "General Business & Trading" },
    { name: "Abu Dhabi DED", location: "Abu Dhabi", specialty: "General Business & Trading" },
    { name: "Sharjah DED", location: "Sharjah", specialty: "General Business & Trading" },
    { name: "Ajman DED", location: "Ajman", specialty: "General Business & Trading" },
    { name: "Fujairah DED", location: "Fujairah", specialty: "General Business & Trading" },
    { name: "RAK DED", location: "Ras Al Khaimah", specialty: "General Business & Trading" },
    { name: "UAQ DED", location: "Umm Al Quwain", specialty: "General Business & Trading" }
  ];

  const requiredDocuments = [
    "Passport copy",
    "Passport-size photo",
    "Visa copy (if applicable)",
    "Email ID",
    "Mobile number",
    "Proposed company name"
  ];

  useEffect(() => {
    if (currentStep === 3) {
      fetchPackages();
    }
  }, [currentStep, applicationData.selectedZone]);

  const fetchPackages = async () => {
    if (!applicationData.selectedZone) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('freezone_name', applicationData.selectedZone)
        .order('price_aed', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
      setFilteredPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again.",
        variant: "destructive"
      });
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

  const generateServiceRequestId = () => {
    return 'SR' + Date.now().toString().slice(-8);
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.fullName || !applicationData.email || !applicationData.contactNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const serviceRequestId = generateServiceRequestId();
      
      // Here you would typically save to database
      toast({
        title: "Application Submitted Successfully!",
        description: `Your Service Request Number is: ${serviceRequestId}`,
      });

      // Reset and show success
      setTimeout(() => {
        navigate('/', { state: { serviceRequestId } });
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 5 && <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Jurisdiction</h2>
        <p className="text-muted-foreground">Do you want to set up your business in Mainland or Free Zone?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            applicationData.jurisdictionType === 'mainland' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setApplicationData({...applicationData, jurisdictionType: 'mainland', selectedZone: ''})}
        >
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mainland</h3>
            <p className="text-sm text-muted-foreground">Setup your business in UAE mainland with local sponsorship</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            applicationData.jurisdictionType === 'freezone' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setApplicationData({...applicationData, jurisdictionType: 'freezone', selectedZone: ''})}
        >
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Free Zone</h3>
            <p className="text-sm text-muted-foreground">100% foreign ownership with tax benefits</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const options = applicationData.jurisdictionType === 'freezone' ? freeZones : mainlandOptions;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Select {applicationData.jurisdictionType === 'freezone' ? 'Free Zone' : 'Emirate'}
          </h2>
          <p className="text-muted-foreground">Choose your preferred jurisdiction</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option) => (
            <Card 
              key={option.name}
              className={`cursor-pointer border-2 transition-all ${
                applicationData.selectedZone === option.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setApplicationData({...applicationData, selectedZone: option.name})}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{option.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {option.location}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{option.specialty}</p>
                  </div>
                  <Badge variant="outline">{option.location}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Package</h2>
        <p className="text-muted-foreground">Choose the best package for your business</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading packages...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`cursor-pointer border-2 transition-all ${
                applicationData.selectedPackage?.id === pkg.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setApplicationData({...applicationData, selectedPackage: pkg})}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{pkg.package_name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.freezone_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{formatPrice(pkg.price_aed)}</div>
                    <div className="text-xs text-muted-foreground">Starting from</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-medium">{pkg.max_visas}</div>
                    <div className="text-xs text-muted-foreground">Visas</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-medium">{pkg.tenure_years}Y</div>
                    <div className="text-xs text-muted-foreground">Validity</div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="font-medium">3-5</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Required Documents</h2>
        <p className="text-muted-foreground">Please prepare the following documents</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="flex-1">{doc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Processing Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your license will be processed within <strong>3-5 working days</strong> after document submission and verification.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Contact Details & Documents</h2>
        <p className="text-muted-foreground">Please provide your details and upload required documents</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={applicationData.fullName}
              onChange={(e) => setApplicationData({...applicationData, fullName: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={applicationData.email}
              onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact Number *</Label>
            <Input
              id="phone"
              value={applicationData.contactNumber}
              onChange={(e) => setApplicationData({...applicationData, contactNumber: e.target.value})}
              placeholder="Enter your contact number"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG (Max 10MB each)</p>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-4"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setApplicationData({...applicationData, documents: files});
              }}
            />
          </div>
          {applicationData.documents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Uploaded Files:</p>
              <div className="space-y-2">
                {applicationData.documents.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Apply for Trade License</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {/* Progress Indicator */}
        {renderStepIndicator()}
        
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / 5) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of 5
          </p>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < 5 ? (
            <Button 
              onClick={() => {
                if (currentStep === 1 && !applicationData.jurisdictionType) {
                  toast({ title: "Please select a jurisdiction type", variant: "destructive" });
                  return;
                }
                if (currentStep === 2 && !applicationData.selectedZone) {
                  toast({ title: "Please select a zone", variant: "destructive" });
                  return;
                }
                if (currentStep === 3 && !applicationData.selectedPackage) {
                  toast({ title: "Please select a package", variant: "destructive" });
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              disabled={
                (currentStep === 1 && !applicationData.jurisdictionType) ||
                (currentStep === 2 && !applicationData.selectedZone) ||
                (currentStep === 3 && !applicationData.selectedPackage)
              }
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitApplication}
              disabled={loading || !applicationData.fullName || !applicationData.email || !applicationData.contactNumber}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeLicenseApplication;