import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Upload, Eye, MapPin, Award, Building2, Phone, Mail, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface DocumentRequirement {
  id: string;
  document_name: string;
  document_description: string;
  is_required: boolean;
  template_url?: string;
}

interface ApplicationData {
  packageId: string;
  freezoneName: string;
  packageName: string;
  packageType: string;
  legalEntityType: string;
  numberOfShareholders: number;
  numberOfVisas: number;
}

const TradeApplicationFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [freezoneInfo, setFreezoneInfo] = useState<FreezoneInfo | null>(null);
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    packageId: searchParams.get('packageId') || '',
    freezoneName: searchParams.get('freezone') || '',
    packageName: searchParams.get('packageName') || '',
    packageType: searchParams.get('packageType') || '',
    legalEntityType: 'FZ-LLC',
    numberOfShareholders: 1,
    numberOfVisas: 1
  });
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({});
  const [applicationId, setApplicationId] = useState<string>('');

  useEffect(() => {
    if (!applicationData.freezoneName) {
      navigate('/trade-license');
      return;
    }
    fetchData();
  }, [applicationData.freezoneName, applicationData.legalEntityType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch freezone information
      const { data: freezoneData, error: freezoneError } = await supabase
        .from('freezone_info')
        .select('*')
        .eq('freezone_name', applicationData.freezoneName)
        .single();

      if (freezoneError && freezoneError.code !== 'PGRST116') {
        throw freezoneError;
      }

      if (freezoneData) {
        setFreezoneInfo(freezoneData);
      }

      // Fetch document requirements
      const { data: docsData, error: docsError } = await supabase
        .from('document_requirements')
        .select('*')
        .eq('freezone_name', applicationData.freezoneName)
        .eq('legal_entity_type', applicationData.legalEntityType);

      if (docsError) throw docsError;
      setDocumentRequirements(docsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load application data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApplicationId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TL-${timestamp.slice(-6)}${random}`;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/trade-license');
    }
  };

  const toggleFaq = (question: string) => {
    setExpandedFaqs(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const handleFileUpload = (documentId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPG, or PNG files only.",
        variant: "destructive"
      });
      return;
    }

    setUploadedDocuments(prev => ({
      ...prev,
      [documentId]: file
    }));

    toast({
      title: "File uploaded",
      description: `${file.name} uploaded successfully.`,
    });
  };

  const handleSubmitApplication = async () => {
    try {
      setLoading(true);
      const newApplicationId = generateApplicationId();
      
      // Create application in database
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert({
          application_id: newApplicationId,
          freezone_name: applicationData.freezoneName,
          package_id: parseInt(applicationData.packageId),
          package_name: applicationData.packageName,
          package_type: applicationData.packageType,
          legal_entity_type: applicationData.legalEntityType,
          number_of_shareholders: applicationData.numberOfShareholders,
          number_of_visas: applicationData.numberOfVisas,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (appError) throw appError;

      setApplicationId(newApplicationId);
      
      toast({
        title: "Application Submitted",
        description: `Your trade license application has been submitted successfully. Application ID: ${newApplicationId}`,
      });

      setCurrentStep(5); // Success step

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {applicationData.freezoneName}
          </CardTitle>
          <CardDescription>
            Package: {applicationData.packageName} ({applicationData.packageType})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {freezoneInfo && (
            <>
              <p className="text-sm text-muted-foreground">{freezoneInfo.description}</p>
              
              <div>
                <h4 className="font-medium mb-2">Key Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {freezoneInfo.key_benefits?.map((benefit, index) => (
                    <Badge key={index} variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{freezoneInfo.office_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{freezoneInfo.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={freezoneInfo.website_url} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline">
                    Visit Website
                  </a>
                </div>
              </div>

              {freezoneInfo.faqs && Object.keys(freezoneInfo.faqs).length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Frequently Asked Questions</h4>
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
                </div>
              )}
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="legalEntity">Legal Entity Type</Label>
              <Select value={applicationData.legalEntityType} onValueChange={(value) => 
                setApplicationData(prev => ({ ...prev, legalEntityType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FZ-LLC">FZ-LLC</SelectItem>
                  <SelectItem value="Branch">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="shareholders">Number of Shareholders</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={applicationData.numberOfShareholders}
                onChange={(e) => setApplicationData(prev => ({ 
                  ...prev, 
                  numberOfShareholders: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Required Documents
          </CardTitle>
          <CardDescription>
            Based on {applicationData.freezoneName} - {applicationData.legalEntityType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentRequirements.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{doc.document_name}</h4>
                      {doc.is_required ? (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doc.document_description}
                    </p>
                  </div>
                  {doc.template_url && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Template
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload all required documents for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentRequirements.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{doc.document_name}</h4>
                  {uploadedDocuments[doc.id] && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(doc.id, file);
                      }
                    }}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {uploadedDocuments[doc.id] && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      {uploadedDocuments[doc.id].name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Review & Submit
          </CardTitle>
          <CardDescription>
            Please review your application before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Application Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Freezone:</span>
                <p className="font-medium">{applicationData.freezoneName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Package:</span>
                <p className="font-medium">{applicationData.packageName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Legal Entity:</span>
                <p className="font-medium">{applicationData.legalEntityType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Shareholders:</span>
                <p className="font-medium">{applicationData.numberOfShareholders}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Uploaded Documents</h4>
            <div className="space-y-2">
              {documentRequirements.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-sm">
                  <span>{doc.document_name}</span>
                  {uploadedDocuments[doc.id] ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Uploaded
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {doc.is_required ? 'Required' : 'Optional'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSubmitApplication} 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your trade license application has been submitted and is now under review.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-sm font-medium">Application ID</p>
            <p className="text-lg font-bold text-primary">{applicationId}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => navigate('/trade-license')} className="w-full">
              Back to Trade License
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading && currentStep !== 5) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Trade License Application</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep <= 4 && (
        <div className="p-4 bg-white border-b">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of 4</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        {/* Navigation */}
        {currentStep <= 4 && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Back to Packages' : 'Previous'}
            </Button>
            
            {currentStep < 4 && (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeApplicationFlow;