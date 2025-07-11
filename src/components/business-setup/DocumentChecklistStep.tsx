import React, { useState, useEffect } from "react";
import { FileText, Download, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface DocumentRequirement {
  id: string;
  document_name: string;
  document_description: string;
  is_required: boolean;
  template_url?: string;
  document_type: string;
}

interface DocumentChecklistStepProps {
  selectedFreezone: string;
  selectedType: 'freezone' | 'mainland';
  legalEntityType: string;
  checkedDocuments: string[];
  onDocumentCheck: (documentId: string, checked: boolean) => void;
}

const DocumentChecklistStep: React.FC<DocumentChecklistStepProps> = ({
  selectedFreezone,
  selectedType,
  legalEntityType,
  checkedDocuments,
  onDocumentCheck
}) => {
  const [documents, setDocuments] = useState<DocumentRequirement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedType === 'freezone') {
      fetchDocumentRequirements();
    } else {
      setMainlandDocuments();
    }
  }, [selectedFreezone, selectedType, legalEntityType]);

  const fetchDocumentRequirements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_requirements')
        .select('*')
        .eq('freezone_name', selectedFreezone)
        .eq('legal_entity_type', legalEntityType);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching document requirements:', error);
      // Fallback to default documents
      setDefaultDocuments();
    } finally {
      setLoading(false);
    }
  };

  const setMainlandDocuments = () => {
    const mainlandDocs: DocumentRequirement[] = [
      {
        id: 'mainland-passport',
        document_name: 'Passport Copy',
        document_description: 'Clear copy of passport for all shareholders and managers',
        is_required: true,
        document_type: 'upload'
      },
      {
        id: 'mainland-emirates-id',
        document_name: 'Emirates ID Copy',
        document_description: 'Copy of Emirates ID if residing in UAE',
        is_required: false,
        document_type: 'upload'
      },
      {
        id: 'mainland-visa',
        document_name: 'UAE Visa Copy',
        document_description: 'Current UAE residence visa copy',
        is_required: false,
        document_type: 'upload'
      },
      {
        id: 'mainland-address-proof',
        document_name: 'Address Proof',
        document_description: 'Utility bill or tenancy contract as address proof',
        is_required: true,
        document_type: 'upload'
      },
      {
        id: 'mainland-bank-certificate',
        document_name: 'Bank Certificate',
        document_description: 'Bank certificate or statement for financial standing',
        is_required: true,
        document_type: 'upload'
      },
      {
        id: 'mainland-noc',
        document_name: 'No Objection Certificate',
        document_description: 'NOC from current employer if employed in UAE',
        is_required: false,
        document_type: 'upload'
      },
      {
        id: 'mainland-photo',
        document_name: 'Passport Size Photograph',
        document_description: 'Recent passport size photographs with white background',
        is_required: true,
        document_type: 'upload'
      }
    ];
    setDocuments(mainlandDocs);
  };

  const setDefaultDocuments = () => {
    const defaultDocs: DocumentRequirement[] = [
      {
        id: 'default-passport',
        document_name: 'Passport Copy',
        document_description: 'Clear copy of passport for all shareholders',
        is_required: true,
        document_type: 'upload'
      },
      {
        id: 'default-emirates-id',
        document_name: 'Emirates ID Copy',
        document_description: 'Copy of Emirates ID if applicable',
        is_required: false,
        document_type: 'upload'
      },
      {
        id: 'default-visa',
        document_name: 'Visa Copy',
        document_description: 'Current visa copy if residing in UAE',
        is_required: false,
        document_type: 'upload'
      },
      {
        id: 'default-address-proof',
        document_name: 'Address Proof',
        document_description: 'Utility bill or address verification document',
        is_required: true,
        document_type: 'upload'
      },
      {
        id: 'default-photo',
        document_name: 'Passport Size Photo',
        document_description: 'Recent passport size photographs',
        is_required: true,
        document_type: 'upload'
      }
    ];
    setDocuments(defaultDocs);
  };

  const getTimelineSteps = () => {
    if (selectedType === 'freezone') {
      return [
        { step: 'Document Submission', duration: '1 day', status: 'pending' },
        { step: 'Initial Review', duration: '1-2 days', status: 'pending' },
        { step: 'Approval & License Issuance', duration: '1-2 days', status: 'pending' },
        { step: 'Visa Processing (if applicable)', duration: '2-3 days', status: 'pending' }
      ];
    } else {
      return [
        { step: 'Document Submission', duration: '1 day', status: 'pending' },
        { step: 'Initial Approval', duration: '2-3 days', status: 'pending' },
        { step: 'Trade License Issuance', duration: '2-3 days', status: 'pending' },
        { step: 'Visa Processing (if applicable)', duration: '3-5 days', status: 'pending' }
      ];
    }
  };

  const requiredDocs = documents.filter(doc => doc.is_required);
  const optionalDocs = documents.filter(doc => !doc.is_required);
  const checkedRequiredDocs = requiredDocs.filter(doc => checkedDocuments.includes(doc.id));
  const completionPercentage = requiredDocs.length > 0 ? (checkedRequiredDocs.length / requiredDocs.length) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading document requirements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Document Requirements & Timeline</h2>
        <p className="text-muted-foreground">
          Review the required documents and expected timeline for your {selectedType} setup
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Document Checklist Progress
          </CardTitle>
          <CardDescription>
            {checkedRequiredDocs.length} of {requiredDocs.length} required documents confirmed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {completionPercentage === 100 ? 
              "All required documents confirmed! You're ready to proceed." :
              "Please confirm you have all required documents before proceeding."
            }
          </p>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Required Documents
          </CardTitle>
          <CardDescription>
            These documents are mandatory for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredDocs.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={doc.id}
                  checked={checkedDocuments.includes(doc.id)}
                  onCheckedChange={(checked) => onDocumentCheck(doc.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor={doc.id} className="font-medium cursor-pointer">
                        {doc.document_name}
                      </label>
                      <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                    </div>
                    <div className="flex gap-2">
                      {doc.template_url && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Template
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Guide
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.document_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Optional Documents
            </CardTitle>
            <CardDescription>
              These documents may help expedite your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {optionalDocs.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={doc.id}
                    checked={checkedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) => onDocumentCheck(doc.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor={doc.id} className="font-medium cursor-pointer">
                          {doc.document_name}
                        </label>
                        <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                      </div>
                      <div className="flex gap-2">
                        {doc.template_url && (
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Template
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Guide
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doc.document_description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Expected Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Expected Timeline
          </CardTitle>
          <CardDescription>
            Estimated processing time for your {selectedType} setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getTimelineSteps().map((timelineStep, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{timelineStep.step}</span>
                    <span className="text-sm text-muted-foreground">{timelineStep.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>Total Estimated Time:</strong> {selectedType === 'freezone' ? '3-5 working days' : '5-7 working days'} after document submission
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentChecklistStep;