import { useState, useEffect } from "react";
import { TrendingUp, Building2, ShoppingCart, Smartphone, Utensils, Truck, Shield, Store, Monitor, Plane, GraduationCap, Video, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import JoinCommunityForm from "@/components/community/JoinCommunityForm";
import IndustryFeed from "@/components/community/IndustryFeed";

const industries = [
  { name: "Real Estate", icon: Building2, color: "text-blue-600", count: 1240 },
  { name: "Trading", icon: TrendingUp, color: "text-green-600", count: 980 },
  { name: "E-commerce", icon: ShoppingCart, color: "text-purple-600", count: 756 },
  { name: "Fintech", icon: Smartphone, color: "text-indigo-600", count: 645 },
  { name: "Food & Beverage", icon: Utensils, color: "text-orange-600", count: 523 },
  { name: "Logistics", icon: Truck, color: "text-red-600", count: 432 },
  { name: "Health & Wellness", icon: Shield, color: "text-pink-600", count: 398 },
  { name: "Retail", icon: Store, color: "text-yellow-600", count: 367 },
  { name: "IT & Software", icon: Monitor, color: "text-cyan-600", count: 289 },
  { name: "Tourism", icon: Plane, color: "text-emerald-600", count: 234 },
  { name: "Education", icon: GraduationCap, color: "text-violet-600", count: 198 },
  { name: "Media", icon: Video, color: "text-rose-600", count: 156 }
];

const Community = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userCommunityProfile, setUserCommunityProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        checkUserCommunityProfile(user.id);
      }
    } catch (error) {
      console.error('Error checking user auth:', error);
    }
  };

  const checkUserCommunityProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserCommunityProfile(data);
      } else {
        setShowJoinForm(true);
      }
    } catch (error) {
      console.error('Error checking community profile:', error);
    }
  };

  const handleJoinCommunity = (profile: any) => {
    setUserCommunityProfile(profile);
    setShowJoinForm(false);
    toast({
      title: "Welcome to the Community!",
      description: "You can now participate in discussions and connect with other members.",
    });
  };

  const handleIndustryClick = (industryName: string) => {
    setSelectedIndustry(industryName);
  };

  const handleBackToMain = () => {
    setSelectedIndustry(null);
  };

  if (showJoinForm) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <JoinCommunityForm 
          industry=""
          onBack={() => setShowJoinForm(false)}
          onSuccess={handleJoinCommunity} 
        />
      </div>
    );
  }

  if (selectedIndustry) {
    return (
      <IndustryFeed 
        industry={selectedIndustry} 
        onBack={handleBackToMain}
        currentUserId={currentUserId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
            {userCommunityProfile && (
              <p className="text-sm text-muted-foreground">
                Welcome, {userCommunityProfile.username} • {userCommunityProfile.industry}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Join Industry Communities</h2>
        <div className="grid grid-cols-2 gap-3">
          {industries.map((industry, index) => (
            <Card 
              key={index} 
              className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => handleIndustryClick(industry.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <industry.icon className={`h-6 w-6 ${industry.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{industry.name}</h3>
                    <p className="text-xs text-muted-foreground">{industry.count} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Community;