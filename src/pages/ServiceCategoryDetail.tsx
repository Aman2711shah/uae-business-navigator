import { useParams, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import BusinessGrowthAdvisor from "@/components/BusinessGrowthAdvisor";
import ServiceCategoryHeader from "@/components/service-category/ServiceCategoryHeader";
import ServiceOverview from "@/components/service-category/ServiceOverview";
import ServiceBenefits from "@/components/service-category/ServiceBenefits";
import ServiceRequirements from "@/components/service-category/ServiceRequirements";
import ServiceTimelineAndJurisdictions from "@/components/service-category/ServiceTimelineAndJurisdictions";
import ServiceAIAssistant from "@/components/service-category/ServiceAIAssistant";
import ServiceCTA from "@/components/service-category/ServiceCTA";
import ServiceNotFound from "@/components/service-category/ServiceNotFound";
import { serviceCategoryDetails } from "@/data/serviceCategoryData";

const ServiceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryId ? serviceCategoryDetails[categoryId as keyof typeof serviceCategoryDetails] : null;

  if (!category) {
    return <ServiceNotFound />;
  }

  const handleStartApplication = () => {
    navigate(`/application-process/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <ServiceCategoryHeader category={category} />

      <div className="p-4 space-y-6">
        <ServiceOverview category={category} />
        <ServiceBenefits category={category} />
        <ServiceRequirements category={category} />
        <ServiceTimelineAndJurisdictions category={category} />
        <ServiceAIAssistant category={category} />
        
        <BusinessGrowthAdvisor 
          currentService={category.title}
          businessType="General Business"
          companySize="Medium"
          serviceCategory={categoryId}
        />

        <ServiceCTA onStartApplication={handleStartApplication} />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServiceCategoryDetail;