import { useState, useEffect } from "react";
import { Search, Plus, Users, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";

interface Community {
  id: string;
  name: string;
  industry_tag: string;
  description: string;
  member_count: number;
  cover_url?: string;
  slug: string;
}

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const industries = [
    "Real Estate", "Trading", "E-commerce", "Fintech", "Food & Beverage",
    "Logistics", "Health & Wellness", "Retail", "IT & Software", "Tourism",
    "Education", "Media", "Manufacturing", "Consulting", "Finance"
  ];

  useEffect(() => {
    fetchCommunities();
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  useEffect(() => {
    filterCommunities();
  }, [communities, searchTerm, selectedIndustry]);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemberships = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('profile_id', user.id);

      if (error) throw error;
      setUserMemberships(new Set(data?.map(m => m.community_id) || []));
    } catch (error) {
      console.error('Error fetching memberships:', error);
    }
  };

  const filterCommunities = () => {
    let filtered = communities;

    if (searchTerm) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.industry_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(community => community.industry_tag === selectedIndustry);
    }

    setFilteredCommunities(filtered);
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          profile_id: user.id
        });

      if (error) throw error;

      setUserMemberships(prev => new Set([...prev, communityId]));
      
      toast({
        title: "Success",
        description: "You've joined the community!"
      });
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive"
      });
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('profile_id', user.id);

      if (error) throw error;

      setUserMemberships(prev => {
        const newSet = new Set(prev);
        newSet.delete(communityId);
        return newSet;
      });

      toast({
        title: "Success",
        description: "You've left the community"
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: "Error",
        description: "Failed to leave community",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Communities</h1>
          <Button onClick={() => navigate('/create-community')} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="p-4">
        {filteredCommunities.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No communities found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedIndustry !== "all" 
                ? "Try adjusting your search or filters"
                : "Be the first to create a community!"
              }
            </p>
            <Button onClick={() => navigate('/create-community')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((community) => (
              <Card 
                key={community.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/communities/${community.slug}`)}
              >
                <CardContent className="p-4">
                  {community.cover_url && (
                    <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={community.cover_url} 
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {community.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {community.industry_tag}
                      </Badge>
                    </div>

                    {community.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {community.member_count} members
                      </div>

                      <Button
                        size="sm"
                        variant={userMemberships.has(community.id) ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (userMemberships.has(community.id)) {
                            handleLeaveCommunity(community.id);
                          } else {
                            handleJoinCommunity(community.id);
                          }
                        }}
                      >
                        {userMemberships.has(community.id) ? "Leave" : "Join"}
                      </Button>
                    </div>
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

export default Communities;