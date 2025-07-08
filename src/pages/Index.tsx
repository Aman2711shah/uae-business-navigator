import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SpecialOffer from "@/components/SpecialOffer";
import QuickActions from "@/components/QuickActions";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <Header />
      <SearchBar />
      <SpecialOffer />
      <QuickActions />
      <BottomNavigation />
    </div>
  );
};

export default Index;
