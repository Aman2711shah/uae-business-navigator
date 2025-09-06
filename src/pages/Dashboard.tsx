import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { Calendar, FileText, CreditCard, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Mock user data - in real app, fetch from Supabase profiles table
  const userProfile = {
    name: user?.user_metadata?.full_name || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+971-50-123-4567",
    company: "Al-Rashid Trading LLC",
    memberSince: "2023",
    avatar: "/placeholder.svg"
  };

  const stats = [
    { label: "Active Services", value: "5", color: "text-primary" },
    { label: "Completed", value: "12", color: "text-emerald-600" },
    { label: "In Progress", value: "3", color: "text-orange-600" }
  ];

  const quickActions = [
    {
      id: "book-consultation",
      title: "Book Consultation",
      description: "Schedule expert advice",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      action: () => navigate("/growth/booking")
    },
    {
      id: "upload-documents",
      title: "Upload Documents",
      description: "Submit required files",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      action: () => navigate("/services")
    },
    {
      id: "view-invoices",
      title: "View Invoices",
      description: "Check payment history",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => navigate("/more")
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 cursor-pointer" onClick={() => setShowProfileModal(true)}>
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
            <p className="text-muted-foreground">{userProfile.email}</p>
            <p className="text-sm text-muted-foreground">{userProfile.company}</p>
            <Badge variant="secondary" className="mt-2">
              Member since {userProfile.memberSince}
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowProfileModal(true)}
            className="hover:bg-primary/10"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.id}
              className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;