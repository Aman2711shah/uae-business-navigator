import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  created_at: string;
}

// Service category mapping with logos
const serviceLogoMap: { [key: string]: string } = {
  "visa": "/src/assets/icons/visa-processing.png",
  "immigration": "/src/assets/icons/visa-processing.png",
  "taxation": "/src/assets/icons/tax-corporate.png",
  "tax": "/src/assets/icons/tax-corporate.png",
  "accounting": "/src/assets/icons/invoices-payments.png",
  "bookkeeping": "/src/assets/icons/invoices-payments.png",
  "payroll": "/src/assets/icons/profile-settings.png",
  "hr": "/src/assets/icons/profile-settings.png",
  "legal": "/src/assets/icons/trade-license.png",
  "compliance": "/src/assets/icons/trade-license.png",
  "payment": "/src/assets/icons/banking.png",
  "banking": "/src/assets/icons/banking.png",
  "company": "/src/assets/icons/start-company.png",
  "formation": "/src/assets/icons/start-company.png",
  "setup": "/src/assets/icons/start-company.png",
  "license": "/src/assets/icons/start-company.png",
  "government": "/src/assets/icons/freezone-info.png",
  "approval": "/src/assets/icons/freezone-info.png",
  "certificate": "/src/assets/icons/freezone-info.png",
  "advisory": "/src/assets/icons/business-growth.png",
  "growth": "/src/assets/icons/business-growth.png",
  "consulting": "/src/assets/icons/business-growth.png",
  "attestation": "/src/assets/icons/my-documents.png",
  "consular": "/src/assets/icons/my-documents.png",
  "document": "/src/assets/icons/my-documents.png",
  "other": "/src/assets/icons/logistics.png",
  "support": "/src/assets/icons/logistics.png",
  "typing": "/src/assets/icons/logistics.png",
  "courier": "/src/assets/icons/logistics.png"
};

const getServiceLogo = (serviceName: string): string => {
  const name = serviceName.toLowerCase();
  for (const [keyword, logo] of Object.entries(serviceLogoMap)) {
    if (name.includes(keyword)) {
      return logo;
    }
  }
  return "/src/assets/icons/start-company.png"; // Default logo
};

const ServicesSupabase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, created_at')
        .order('name');

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    navigate(`/service-detail/${service.id}`);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="bg-white border-b border-border p-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Business Services</h1>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">Business Services</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 md:h-12 bg-muted/50 border-none rounded-xl text-sm md:text-base"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4">
        {filteredServices.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No services found matching your search." : "No services available."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card 
              key={service.id} 
              className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">
                      <img 
                        src={getServiceLogo(service.name)} 
                        alt={service.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Building2 className="h-6 w-6 text-brand-blue hidden" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{service.name}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">Available</Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServicesSupabase;