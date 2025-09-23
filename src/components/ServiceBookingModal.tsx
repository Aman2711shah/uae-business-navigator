import { useState, useEffect } from "react";
import { X, Upload, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";
import { validateEmail, validateFile, normalizePhone, contactFormSchema } from "@/lib/validation";

// Note: Add your Stripe publishable key here when ready to use Stripe.js fallback
// const STRIPE_PUBLISHABLE_KEY = "pk_test_your_actual_key_here";

interface SubService {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
  required_documents: string[] | null;
  service_id: string;
}

interface Service {
  id: string;
  name: string;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

interface DocumentUpload {
  fieldName: string;
  file: File | null;
  fileName: string;
  uploaded: boolean;
  uploading: boolean;
}

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subService: SubService;
  parentService: Service;
}

const ServiceBookingModal = ({ isOpen, onClose, subService, parentService }: ServiceBookingModalProps) => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1); // 1: Contact Info, 2: Document Upload, 3: Confirmation
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check authentication and pre-fill user data
  useEffect(() => {
    if (isOpen && !authLoading) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit a service application.",
          variant: "destructive"
        });
        onClose();
        return;
      }
      
      // Pre-fill user information if available
      setContactInfo(prev => ({
        ...prev,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || ""
      }));
    }
  }, [isOpen, user, authLoading, onClose, toast]);

  // Initialize documents when modal opens
  useState(() => {
    if (subService.required_documents) {
      setDocuments(
        subService.required_documents.map(docName => ({
          fieldName: docName,
          file: null,
          fileName: "",
          uploaded: false,
          uploading: false
        }))
      );
    }
  });

  const validateContactInfo = () => {
    const errors: Record<string, string> = {};
    
    try {
      contactFormSchema.parse(contactInfo);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      if (error.issues) {
        error.issues.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
      }
      setValidationErrors(errors);
      return false;
    }
  };

  const validateDocuments = () => {
    return documents.every(doc => doc.uploaded || doc.file !== null);
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (docIndex: number, file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setDocuments(prev => prev.map((doc, index) => 
      index === docIndex 
        ? { ...doc, file, fileName: file.name }
        : doc
    ));
  };

  const uploadDocument = async (docIndex: number) => {
    const doc = documents[docIndex];
    if (!doc.file || !submissionId) return;

    setDocuments(prev => prev.map((d, i) => 
      i === docIndex ? { ...d, uploading: true } : d
    ));

    try {
      const fileExt = doc.file.name.split('.').pop();
      const fileName = `${submissionId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('service-uploads')
        .upload(fileName, doc.file);

      if (uploadError) {
        throw uploadError;
      }

      // Save document metadata
      const { error: dbError } = await supabase
        .from('submission_documents')
        .insert({
          submission_id: submissionId,
          field_name: doc.fieldName,
          file_name: doc.file.name,
          storage_path: fileName,
          content_type: doc.file.type,
          size_bytes: doc.file.size
        });

      if (dbError) {
        throw dbError;
      }

      setDocuments(prev => prev.map((d, i) => 
        i === docIndex 
          ? { ...d, uploaded: true, uploading: false }
          : d
      ));

      toast({
        title: "Document uploaded",
        description: `${doc.fieldName} has been uploaded successfully.`
      });

    } catch (error) {
      logger.error('Upload error:', error);
      setDocuments(prev => prev.map((d, i) => 
        i === docIndex ? { ...d, uploading: false } : d
      ));
      
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!validateContactInfo()) {
        toast({
          title: "Incomplete Information",
          description: "Please fill in all required fields with valid information.",
          variant: "destructive"
        });
        return;
      }

      // Create submission record with proper user authentication
      setSubmitting(true);
      setIsLoading(true);
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Normalize phone number before saving
        const phoneValidation = normalizePhone(contactInfo.phone);
        const normalizedContactInfo = {
          ...contactInfo,
          phone: phoneValidation.formatted || contactInfo.phone
        };

        const { data, error } = await supabase
          .from('submissions')
          .insert({
            user_id: user.id, // Ensure user_id is set for security
            service_id: parentService.id,
            sub_service_id: subService.id,
            contact_info: normalizedContactInfo as any,
            total_price: subService.price,
            notes: contactInfo.notes || null
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSubmissionId(data.id);
        setStep(2);
      } catch (error) {
        logger.error('Submission error:', error);
        toast({
          title: "Submission failed",
          description: "Failed to create submission. Please try again.",
          variant: "destructive"
        });
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    } else if (step === 2) {
      if (!validateDocuments()) {
        toast({
          title: "Documents Required",
          description: "Please upload all required documents before proceeding.",
          variant: "destructive"
        });
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setStep(1);
    setContactInfo({ fullName: "", email: "", phone: "", notes: "" });
    setDocuments([]);
    setSubmissionId(null);
    onClose();
  };

  const getProgress = () => {
    return (step / 3) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Service Application: {subService.name}</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Complete this form to apply for {subService.name}. We'll guide you through the process step by step.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(getProgress())}% Complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={contactInfo.fullName}
                      onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                      aria-describedby={validationErrors.fullName ? "fullName-error" : undefined}
                    />
                    {validationErrors.fullName && (
                      <p id="fullName-error" className="text-sm text-destructive mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactInfoChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1"
                      aria-describedby={validationErrors.email ? "email-error" : undefined}
                    />
                    {validationErrors.email && (
                      <p id="email-error" className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                      placeholder="Enter your phone number (e.g., +971501234567)"
                      className="mt-1"
                      aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                    />
                    {validationErrors.phone && (
                      <p id="phone-error" className="text-sm text-destructive mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={contactInfo.notes}
                    onChange={(e) => handleContactInfoChange('notes', e.target.value)}
                    placeholder="Any additional information or special requirements"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Service Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{subService.name}</span>
                  </div>
                  {subService.price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {subService.price} {subService.currency || 'AED'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Document Upload */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Document Upload
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Please upload the following required documents for your application:
                </p>

                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{doc.fieldName}</span>
                        {doc.uploaded ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : doc.file ? (
                          <Badge variant="secondary">
                            Ready to upload
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Required
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileSelect(index, file);
                            }
                          }}
                          disabled={doc.uploaded}
                          className="flex-1"
                          aria-label={`Upload ${doc.fieldName}`}
                        />
                        
                        {doc.file && !doc.uploaded && (
                          <Button
                            onClick={() => uploadDocument(index)}
                            disabled={doc.uploading}
                            size="sm"
                          >
                            {doc.uploading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                      </div>

                      {doc.fileName && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {doc.fileName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  Your service application has been submitted and is now being processed.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Application ID</p>
                  <p className="font-mono text-lg font-semibold">{submissionId}</p>
                </div>

                <div className="text-left space-y-2 text-sm mb-6">
                  <h4 className="font-semibold">What happens next?</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Our team will review your application within 24 hours</li>
                    <li>We'll contact you at {contactInfo.email} with the next steps</li>
                    <li>Any additional requirements will be communicated promptly</li>
                    <li>You'll receive regular updates on your application status</li>
                  </ul>
                </div>

                {/* Final Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        logger.info('Starting payment process for submission:', submissionId);
                        
                        // Call our Supabase edge function to create checkout session
                        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                          body: { submissionId }
                        });
                        
                        logger.info('Checkout session response:', { data, error });
                        
                        if (error) {
                          logger.error('Edge function error:', error);
                          throw new Error(error.message || 'Failed to create checkout session');
                        }
                        
                        if (!data) {
                          throw new Error('No response data from checkout session');
                        }
                        
                        // Open Stripe checkout in a new tab (recommended for security)
                        if (data.checkoutUrl) {
                          // Redirecting to checkout URL
                          window.open(data.checkoutUrl, '_blank');
                          return;
                        }
                        
                        // Fallback: redirect in current window if new tab fails
                        if (data.sessionId) {
                          // Using session ID fallback
                          window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
                          return;
                        }
                        
                        throw new Error('No checkout URL or session ID returned from payment service');
                      } catch (error) {
                        logger.error('Payment error details:', error);
                        toast({
                          title: "Payment Error",
                          description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
                          variant: "destructive"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Proceed to Payment
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      window.location.href = `tel:+971559986386`;
                    }}
                  >
                    Call Business Setup Advisor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between pt-6 border-t">
          {step === 3 ? (
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={submitting || (step === 1 && !validateContactInfo()) || (step === 2 && !validateDocuments())}
              >
                {submitting ? "Processing..." : step === 2 ? "Complete Application" : "Next"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;