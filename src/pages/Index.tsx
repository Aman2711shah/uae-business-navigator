import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SpecialOffer from "@/components/SpecialOffer";
import QuickActions from "@/components/QuickActions";
import BottomNavigation from "@/components/BottomNavigation";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Show welcome modal only on first signup, not subsequent logins
    const hasSeenWelcome = localStorage.getItem('wazeet-welcome-shown');
    const hasShownWelcomeThisSession = sessionStorage.getItem('wazeet-welcome-this-session');
    
    if (user && !hasSeenWelcome && !hasShownWelcomeThisSession) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('wazeet-welcome-this-session', 'true');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <Header />
      <SearchBar />
      <SpecialOffer />
      <QuickActions />
      <BottomNavigation />
      
      
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  );
};

export default Index;
