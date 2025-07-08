import { MessageSquare, Plus, Search, Bell, Heart, MessageCircle, Share2, Flag, TrendingUp, Building2, ShoppingCart, Smartphone, Utensils, Truck, Shield, Store, Monitor, Plane, GraduationCap, Video, Users, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";

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

const samplePosts = [
  {
    id: 1,
    user: { name: "Ahmed Al-Mansouri", avatar: "/placeholder.svg", role: "Business Owner" },
    industry: "Real Estate",
    timeAgo: "2h ago",
    content: "Looking for advice on setting up a real estate consultancy in Dubai. What are the licensing requirements?",
    likes: 24,
    comments: 8,
    tags: ["Real Estate", "Dubai", "Licensing"],
    hasLiked: false
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", avatar: "/placeholder.svg", role: "Consultant" },
    industry: "E-commerce",
    timeAgo: "4h ago",
    content: "New e-commerce regulations in UAE - here's what you need to know about the updated guidelines for online businesses.",
    likes: 42,
    comments: 15,
    tags: ["E-commerce", "Regulations", "Online Business"],
    hasLiked: true
  },
  {
    id: 3,
    user: { name: "Mohammed Hassan", avatar: "/placeholder.svg", role: "Entrepreneur" },
    industry: "Fintech",
    timeAgo: "6h ago",
    content: "Successfully opened our fintech startup! Here's our journey and the challenges we faced. AMA!",
    likes: 67,
    comments: 23,
    tags: ["Fintech", "Startup", "Success Story"],
    hasLiked: false
  }
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [posts, setPosts] = useState(samplePosts);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            hasLiked: !post.hasLiked, 
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => 
    (selectedIndustry === "All" || post.industry === selectedIndustry) &&
    (post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="orange" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search discussions, topics, or users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
          />
        </div>

        {/* Industry Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant={selectedIndustry === "All" ? "orange" : "outline"} 
            size="sm"
            onClick={() => setSelectedIndustry("All")}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-1" />
            All
          </Button>
          {industries.slice(0, 5).map((industry) => (
            <Button 
              key={industry.name}
              variant={selectedIndustry === industry.name ? "orange" : "outline"} 
              size="sm"
              onClick={() => setSelectedIndustry(industry.name)}
              className="whitespace-nowrap"
            >
              <industry.icon className="h-4 w-4 mr-1" />
              {industry.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Industries Grid */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">Join Industry Communities</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {industries.map((industry, index) => (
            <Card 
              key={index} 
              className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedIndustry(industry.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <industry.icon className={`h-5 w-5 ${industry.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">{industry.name}</h3>
                    <p className="text-xs text-muted-foreground">{industry.count} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Posts Feed */}
        <h2 className="text-lg font-semibold text-foreground mb-3">Recent Discussions</h2>
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{post.user.name}</span>
                      <Badge variant="secondary" className="text-xs">{post.user.role}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.industry}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>

                {/* Tags */}
                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={post.hasLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
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