import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import GrowthHeader from "@/components/growth/GrowthHeader";
import FeaturedOffer from "@/components/growth/FeaturedOffer";
import GrowthServiceCard from "@/components/growth/GrowthServiceCard";
import SuccessStoryCard from "@/components/growth/SuccessStoryCard";
import WorkshopCard from "@/components/growth/WorkshopCard";

import { growthServices, successStories, upcomingWorkshops } from "@/data/growthData";

const Growth = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>([]);

  const handleBookmark = (serviceTitle: string) => {
    setBookmarkedServices(prev => 
      prev.includes(serviceTitle) 
        ? prev.filter(s => s !== serviceTitle)
        : [...prev, serviceTitle]
    );
  };

  const filteredServices = growthServices.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceId = (serviceTitle: string) => {
    return serviceTitle.toLowerCase().replace(/\s+/g, '-');
  };

  const handleLearnMore = (serviceTitle: string) => {
    const serviceId = getServiceId(serviceTitle);
    navigate(`/growth/service/${serviceId}`);
  };

  const handleBookConsultation = (serviceTitle: string) => {
    const serviceId = getServiceId(serviceTitle);
    navigate(`/growth/booking/${serviceId}`);
  };

  const handleWorkshopRegister = (workshopTitle: string) => {
    const workshopId = workshopTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/growth/workshop/${workshopId}/register`);
  };

  const handleSuccessStoryClick = (companyName: string) => {
    const storyId = companyName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/growth/success-story/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <GrowthHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="p-4 space-y-6">
        {/* Featured Offer */}
        <FeaturedOffer onLearnMore={() => navigate('/growth/package')} />

        {/* Growth Services */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Growth Services</h2>
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <GrowthServiceCard
                key={index}
                service={service}
                isBookmarked={bookmarkedServices.includes(service.title)}
                onBookmark={handleBookmark}
                onBookConsultation={handleBookConsultation}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Success Stories</h2>
          <div className="space-y-3">
            {successStories.map((story, index) => (
              <SuccessStoryCard
                key={index}
                story={story}
                onClick={handleSuccessStoryClick}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Workshops */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Workshops</h2>
          <div className="space-y-3">
            {upcomingWorkshops.map((workshop, index) => (
              <WorkshopCard
                key={index}
                workshop={workshop}
                onRegister={handleWorkshopRegister}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
      
    </div>
  );
};

export default Growth;