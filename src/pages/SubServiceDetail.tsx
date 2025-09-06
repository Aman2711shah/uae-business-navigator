import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, FileText, DollarSign, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import ServiceBookingModal from "@/components/ServiceBookingModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface SubService {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
  timeline: string | null;
  required_documents: string[] | null;
  service_id: string;
  metadata: any;
}

interface Service {
  id: string;
  name: string;
}

const SubServiceDetail = () => {
  const { subServiceId } = useParams<{ subServiceId: string }>();
  const { toast } = useToast();
  const [subService, setSubService] = useState<SubService | null>(null);
  const [parentService, setParentService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (subServiceId) {
      fetchSubServiceDetails();
    }
    
    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [subServiceId]);

  const fetchSubServiceDetails = async () => {
    if (!subServiceId) return;

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      // Fetch sub-service details with parent service
      const { data: subServiceData, error: subServiceError } = await supabase
        .from('sub_services')
        .select(`
          id, name, price, currency, timeline, required_documents, service_id, metadata,
          services!inner(id, name)
        `)
        .eq('id', subServiceId)
        .single();

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (subServiceError) {
        logger.error('Error fetching sub-service:', subServiceError);
        toast({
          title: "Error",
          description: "Failed to load service details.",
          variant: "destructive"
        });
        return;
      }

      if (!subServiceData) {
        logger.warn('No sub-service data found for ID:', subServiceId);
        setSubService(null);
        setParentService(null);
        return;
      }

      setSubService(subServiceData);
      setParentService(subServiceData.services || null);
    } catch (error) {
      // Only log error if request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        logger.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load service details.",
          variant: "destructive"
        });
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleStartService = () => {
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!subService || !parentService) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const description = subService.metadata?.description || 
    `Professional ${subService.name.toLowerCase()} service with expert guidance and complete documentation support.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/service-detail/${parentService.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{subService.name}</h1>
            <p className="text-muted-foreground">{parentService.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Service Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subService.price && (
                <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Price</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subService.price} {subService.currency || 'AED'}
                    </p>
                  </div>
                </div>
              )}
              
              {subService.timeline && (
                <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="text-lg font-semibold text-foreground">{subService.timeline}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        {subService.required_documents && subService.required_documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please prepare the following documents for your application:
              </p>
              <ul className="space-y-3">
                {subService.required_documents.map((document, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{document}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Additional Service Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Expert consultation and guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Complete document preparation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Government liaison and processing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Regular status updates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Post-completion support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-4">
              Begin your application process and we'll guide you through every step
            </p>
            <Button size="lg" className="w-full" onClick={handleStartService}>
              Start Service Application
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Service Booking Modal */}
      {showBookingModal && (
        <ServiceBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          subService={subService}
          parentService={parentService}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default SubServiceDetail;