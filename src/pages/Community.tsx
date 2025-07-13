import { useState, useEffect } from "react";
import { TrendingUp, Building2, ShoppingCart, Smartphone, Utensils, Truck, Shield, Store, Monitor, Plane, GraduationCap, Video, Users, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import IndustrySelection from "@/components/community/IndustrySelection";
import CommunityEntryForm from "@/components/community/CommunityEntryForm";
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
  const [showIndustrySelection, setShowIndustrySelection] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
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
        setShowIndustrySelection(true);
      }
    } catch (error) {
      console.error('Error checking community profile:', error);
    }
  };

  const handleIndustrySelectionContinue = (industries: string[]) => {
    setSelectedIndustries(industries);
    setShowIndustrySelection(false);
    setShowEntryForm(true);
  };

  const handleJoinCommunity = (profile: any) => {
    setUserCommunityProfile(profile);
    setShowEntryForm(false);
    // Set the first industry as selected by default
    if (profile.industries && profile.industries.length > 0) {
      setSelectedIndustry(profile.industries[0]);
    }
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

  if (showIndustrySelection) {
    return (
      <IndustrySelection onContinue={handleIndustrySelectionContinue} />
    );
  }

  if (showEntryForm) {
    return (
      <CommunityEntryForm 
        selectedIndustries={selectedIndustries}
        onBack={() => {
          setShowEntryForm(false);
          setShowIndustrySelection(true);
        }}
        onSuccess={handleJoinCommunity} 
      />
    );
  }

  if (selectedIndustry) {
    return (
      <IndustryFeed 
        industry={selectedIndustry} 
        onBack={handleBackToMain}
        currentUserId={currentUserId}
        userProfile={userCommunityProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
            {userCommunityProfile && (
              <p className="text-sm text-muted-foreground">
                Welcome back, {userCommunityProfile.username}
              </p>
            )}
          </div>
        </div>

        {/* Industry Selector */}
        {userCommunityProfile && userCommunityProfile.industries && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Your Communities</label>
            <Select value={selectedIndustry || ""} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry community" />
              </SelectTrigger>
              <SelectContent>
                {userCommunityProfile.industries.map((industry: string) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex flex-wrap gap-2">
              {userCommunityProfile.industries.map((industry: string) => (
                <Badge 
                  key={industry} 
                  variant={selectedIndustry === industry ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content based on selection */}
      <div className="p-4">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Welcome to the Community
          </h2>
          <p className="text-muted-foreground mb-6">
            {userCommunityProfile ? 
              "Select an industry above to start engaging with your communities" :
              "Join industry communities to connect with like-minded professionals"
            }
          </p>
          {userCommunityProfile && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Business Stage:</strong> {userCommunityProfile.business_stage}</p>
              <p><strong>Company:</strong> {userCommunityProfile.company_name}</p>
              {userCommunityProfile.about_you && (
                <p className="mt-4 text-left max-w-md mx-auto">
                  <strong>About:</strong> {userCommunityProfile.about_you}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Community;