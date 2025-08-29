import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle, FileText, X, Eye, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentRequirement {
  id: string;
  document_name: string;
  document_description: string;
  is_required: boolean;
  template_url?: string;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
}

interface DocumentUploadStepProps {
  documents: DocumentRequirement[];
  uploadedFiles: Record<string, UploadedFile>;
  onFileUpload: (documentId: string, file: File) => void;
  onFileRemove: (documentId: string) => void;
  onGenerateApplicationId: () => string;
  applicationData: any;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  documents,
  uploadedFiles,
  onFileUpload,
  onFileRemove,
  onGenerateApplicationId,
  applicationData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (documentId: string, file: File) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPG, or PNG files only.",
        variant: "destructive"
      });
      return;
    }

    onFileUpload(documentId, file);
  };

  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);
      const newApplicationId = onGenerateApplicationId();
      
      // Create application in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');
      
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert({
          application_id: newApplicationId,
          user_id: user.id,
          freezone_name: applicationData.selectedFreezone,
          package_id: applicationData.selectedPackage?.id || null,
          package_name: applicationData.selectedPackage?.package_name || 'Custom Package',
          package_type: applicationData.selectedPackage?.package_type || applicationData.selectedType,
          legal_entity_type: applicationData.legalEntityType || 'FZ-LLC',
          number_of_shareholders: applicationData.numberOfShareholders || 1,
          number_of_visas: applicationData.visaCount || 0,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (appError) throw appError;

      // Upload files to storage and save document records
      const uploadPromises = Object.entries(uploadedFiles).map(async ([docId, fileData]) => {
        if (fileData.status === 'completed') {
          const filePath = `applications/${newApplicationId}/${docId}-${fileData.file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('application-documents')
            .upload(filePath, fileData.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            return;
          }

          // Save document upload record
          await supabase
            .from('document_uploads')
            .insert({
              application_id: appData.id,
              document_requirement_id: docId,
              file_name: fileData.file.name,
              file_path: filePath,
              file_size: fileData.file.size,
              mime_type: fileData.file.type,
              upload_status: 'completed'
            });
        }
      });

      await Promise.all(uploadPromises);
      
      setApplicationId(newApplicationId);
      setIsSubmitted(true);
      
      toast({
        title: "Application Submitted",
        description: `Your trade license application has been submitted successfully. Application ID: ${newApplicationId}`,
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUploadStats = () => {
    const totalRequired = documents.filter(doc => doc.is_required).length;
    const uploadedRequired = documents.filter(doc => 
      doc.is_required && uploadedFiles[doc.id]?.status === 'completed'
    ).length;
    
    return { totalRequired, uploadedRequired };
  };

  const canSubmit = () => {
    const { totalRequired, uploadedRequired } = getUploadStats();
    return uploadedRequired === totalRequired && !isSubmitting;
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-green-700 mb-4">
              Your trade license application has been submitted and is now under review.
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Your Application Details</h3>
              <div className="text-left space-y-1">
                <div className="flex justify-between">
                  <span>Application ID:</span>
                  <span className="font-mono font-bold text-primary">{applicationId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <span>{applicationData.selectedFreezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span>{applicationData.selectedPackage?.package_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submission Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Download Application Summary
              </Button>
              <Button variant="outline" className="w-full">
                Track Application Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalRequired, uploadedRequired } = getUploadStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Documents & Submit</h2>
        <p className="text-muted-foreground">
          Upload all required documents to complete your application
        </p>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Progress
          </CardTitle>
          <CardDescription>
            {uploadedRequired} of {totalRequired} required documents uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(uploadedRequired / totalRequired) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {uploadedRequired === totalRequired ? 
              "All required documents uploaded! Ready to submit." :
              `${totalRequired - uploadedRequired} more required documents needed.`
            }
          </p>
        </CardContent>
      </Card>

      {/* Document Upload Areas */}
      <div className="space-y-4">
        {documents.map((doc) => {
          const uploadedFile = uploadedFiles[doc.id];
          const isUploaded = uploadedFile?.status === 'completed';
          const isUploading = uploadedFile?.status === 'uploading';
          const hasError = uploadedFile?.status === 'error';

          return (
            <Card key={doc.id} className={`${isUploaded ? 'border-green-200 bg-green-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {doc.document_name}
                      {doc.is_required ? (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{doc.document_description}</p>
                  </div>
                  {doc.template_url && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Template
                    </Button>
                  )}
                </div>

                {isUploaded ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {uploadedFile.file.name}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onFileRemove(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : isUploading ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{uploadedFile.file.name}</span>
                      <span className="text-sm">{uploadedFile.progress}%</span>
                    </div>
                    <Progress value={uploadedFile.progress} />
                  </div>
                ) : hasError ? (
                  <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">Upload failed. Please try again.</span>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to select
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(doc.id, file);
                        }
                      }}
                      className="hidden"
                      id={`file-${doc.id}`}
                    />
                    <label htmlFor={`file-${doc.id}`}>
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-3 w-3 mr-1" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold">Ready to Submit Your Application?</h3>
            <p className="text-sm text-muted-foreground">
              Once submitted, you will receive an application ID for tracking purposes.
              Our team will review your documents and contact you if any additional information is needed.
            </p>
            <Button 
              onClick={handleSubmitApplication}
              disabled={!canSubmit()}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
            {!canSubmit() && !isSubmitting && (
              <p className="text-sm text-muted-foreground">
                Please upload all required documents before submitting
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadStep;