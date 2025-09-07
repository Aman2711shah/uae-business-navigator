import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  created_at: string;
}

interface SubService {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
  timeline: string | null;
  required_documents: string[] | null;
  service_id: string;
}

const ServiceDetailSupabase = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      fetchServiceAndSubServices();
    }
  }, [serviceId]);

  const fetchServiceAndSubServices = async () => {
    if (!serviceId) return;

    try {
      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('id, name, created_at')
        .eq('id', serviceId)
        .single();

      if (serviceError) {
        console.error('Error fetching service:', serviceError);
        toast({
          title: "Error",
          description: "Failed to load service details.",
          variant: "destructive"
        });
        return;
      }

      setService(serviceData);

      // Fetch sub-services
      const { data: subServicesData, error: subServicesError } = await supabase
        .from('sub_services')
        .select('id, name, price, currency, timeline, required_documents, service_id')
        .eq('service_id', serviceId)
        .order('name');

      if (subServicesError) {
        console.error('Error fetching sub-services:', subServicesError);
        toast({
          title: "Error",
          description: "Failed to load service options.",
          variant: "destructive"
        });
        return;
      }

      setSubServices(subServicesData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load service details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (subService: SubService) => {
    // Navigate to sub-service detail page using React Router
    navigate(`/sub-service-detail/${subService.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/services">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!service) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{service.name}</h1>
            <p className="text-muted-foreground">Choose a service option below</p>
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
            <p className="text-muted-foreground leading-relaxed">
              Choose the right service package to get started. Each option is tailored to your business needs with full support from our experts.
            </p>
            
            {/* Add specific service descriptions */}
            {service.name === "VAT Services" && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">VAT Registration & Deregistration</h4>
                  <p className="text-sm text-muted-foreground">Full support to register or deregister your VAT with FTA, including consultation, filing, and document review.</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">VAT Amendment</h4>
                  <p className="text-sm text-muted-foreground">Hassle-free updates to your VAT profile (license, activity, address) with expert handling of compliance paperwork.</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">VAT Return Filing</h4>
                  <p className="text-sm text-muted-foreground">Accurate quarterly VAT return preparation and submission, ensuring compliance and avoiding penalties.</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">VAT Refund Request</h4>
                  <p className="text-sm text-muted-foreground">Assistance with VAT refund applications, including eligibility check, filing, and follow-up with authorities.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sub-Services List */}
        {subServices.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No service options available for this service at the moment.
              </p>
              <Link to="/services" className="mt-4 inline-block">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {subServices.map((subService) => (
              <Card key={subService.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {subService.name}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-4">
                        {subService.price && (
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-primary">
                              {subService.price}
                            </span>
                            <span className="text-muted-foreground">
                              {subService.currency || 'AED'}
                            </span>
                          </div>
                        )}
                        
                        {subService.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {subService.timeline}
                            </span>
                          </div>
                        )}
                      </div>

                      {subService.required_documents && subService.required_documents.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Required Documents:</p>
                          <div className="flex flex-wrap gap-2">
                            {subService.required_documents.slice(0, 3).map((doc, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                            {subService.required_documents.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{subService.required_documents.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => handleViewDetails(subService)}
                      className="ml-4"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServiceDetailSupabase;