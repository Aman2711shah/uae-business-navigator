import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Phone, CreditCard, CheckCircle, X, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { serviceApplicationSchema, type ServiceApplicationFormData } from '@/lib/validations';
import { uploadDocuments } from '@/lib/uploads';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
  uploaded?: boolean;
  progress?: number;
  error?: string;
  storagePath?: string;
}

const CONTACT_PHONE = '+971559986386';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ServiceApplication: React.FC = () => {
  const { subServiceId } = useParams<{ subServiceId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);

  // Check for cancelled payment
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('cancelled') === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again when you're ready.",
        variant: "destructive"
      });
    }
  }, [location.search, toast]);

  const form = useForm<ServiceApplicationFormData>({
    resolver: zodResolver(serviceApplicationSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      company: '',
      businessActivity: '',
      notes: ''
    }
  });

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = [];

    files.forEach(file => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please use PDF, PNG, or JPEG files.`,
          variant: "destructive"
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive"
        });
        return;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        uploaded: false,
        progress: 0
      });
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Clear the input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadDocuments = async () => {
    if (!user || selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const files = selectedFiles.map(f => f.file);
      
      const onProgress = (fileIndex: number, progress: number) => {
        setSelectedFiles(prev => prev.map((file, i) => 
          i === fileIndex ? { ...file, progress } : file
        ));
        
        // Calculate overall progress
        const totalProgress = selectedFiles.reduce((sum, _, i) => {
          const fileProgress = i === fileIndex ? progress : (selectedFiles[i]?.progress || 0);
          return sum + fileProgress;
        }, 0) / selectedFiles.length;
        
        setUploadProgress(totalProgress);
      };

      const uploadResults = await uploadDocuments(user.id, files, onProgress);

      // Update files with upload results
      setSelectedFiles(prev => prev.map((file, i) => ({
        ...file,
        uploaded: true,
        progress: 100,
        storagePath: uploadResults[i]?.path
      })));

      // Prepare form data for submission
      const formData = form.getValues();
      
      // Call the upload-documents edge function to create onboarding submission
      const { data: submissionData, error: submissionError } = await supabase.functions.invoke('upload-documents', {
        body: {
          userName: formData.name,
          userEmail: formData.email,
          contactInfo: {
            phone: formData.phone,
            company: formData.company,
            businessActivity: formData.businessActivity,
            notes: formData.notes
          },
          documents: uploadResults
        }
      });

      if (submissionError) {
        throw new Error(submissionError.message || 'Failed to create submission record');
      }

      setSubmissionId(submissionData.onboardingId);
      setAllFilesUploaded(true);
      
      toast({
        title: "Documents Uploaded Successfully",
        description: "Your documents have been uploaded and your application has been submitted.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload documents. Please try again.';
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCallAdvisor = () => {
    window.location.href = `tel:${CONTACT_PHONE}`;
    
    toast({
      title: "Calling Business Setup Advisor",
      description: `Dialing ${CONTACT_PHONE}...`,
    });
  };

  const handleProceedToPayment = async () => {
    if (!submissionId || !user) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          onboardingId: submissionId,
          customerEmail: user.email,
          amount: 4999, // $49.99 - you can adjust this based on the service
          currency: 'usd'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data?.sessionId) {
        // Handle with Stripe.js if needed
        console.log('Session ID:', data.sessionId);
        window.location.href = data.url;
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to setup payment. Please try again.';
      toast({
        title: "Payment Setup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.formState.isValid && selectedFiles.length > 0;
  const canProceedToPayment = allFilesUploaded && submissionId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Application</h1>
            <p className="text-muted-foreground">Complete your application to get started</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Enter your full name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="+971 XX XXX XXXX"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  {...form.register('company')}
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessActivity">Business Activity *</Label>
              <Input
                id="businessActivity"
                {...form.register('businessActivity')}
                placeholder="Describe your business activity"
              />
              {form.formState.errors.businessActivity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.businessActivity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Any additional information you'd like to share"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Please upload the required documents for your application. Accepted formats: PDF, PNG, JPEG (max 10MB per file).
              </p>

              {/* File Input */}
              <div>
                <Label htmlFor="documents" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Choose files to upload</p>
                    <p className="text-xs text-muted-foreground">PDF, PNG, JPEG up to 10MB each</p>
                  </div>
                </Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileSelection}
                  className="hidden"
                />
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.uploaded ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : isUploading && file.progress !== undefined ? (
                          <div className="w-16">
                            <Progress value={file.progress} className="h-2" />
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading documents...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Upload Button */}
              {selectedFiles.length > 0 && !allFilesUploaded && (
                <Button
                  onClick={handleUploadDocuments}
                  disabled={isUploading || !isFormValid}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Documents'}
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {allFilesUploaded && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Application Submitted Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Your application has been submitted successfully. Choose your next step:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCallAdvisor}
                  className="h-auto p-4 flex-col items-start text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Call Business Setup Advisor</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Speak with our expert for personalized guidance
                  </p>
                </Button>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting || !canProceedToPayment}
                  className="h-auto p-4 flex-col items-start text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">
                      {isSubmitting ? 'Setting up...' : 'Proceed to Payment'}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">
                    Complete your service application
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Validation Warning */}
        {!isFormValid && selectedFiles.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete the form and upload at least one document to proceed.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServiceApplication;