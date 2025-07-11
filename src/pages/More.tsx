import { useState } from "react";
import { User, Calendar, FileText, CreditCard, Bell, Bookmark, Globe, HelpCircle, MessageCircle, Star, Shield, Info, ChevronRight, Edit, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { VirtualAssistant } from "@/components/VirtualAssistant";
import { SupportAssistant } from "@/components/SupportAssistant";

const menuSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile Settings", description: "Edit name, email, and profile", hasNotification: false },
      { icon: Calendar, label: "My Bookings", description: "View appointments and consultations", hasNotification: true, count: 3 },
      { icon: CreditCard, label: "Invoices & Payments", description: "Billing history and payments", hasNotification: false },
      { icon: FileText, label: "My Documents", description: "Uploaded licenses and documents", hasNotification: false }
    ]
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Manage alerts and updates", hasNotification: false },
      { icon: Bookmark, label: "Saved Services", description: "Bookmarked services and offers", hasNotification: false },
      { icon: Globe, label: "Language Settings", description: "English / العربية", hasNotification: false }
    ]
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQs", description: "Get help and find answers", hasNotification: false },
      { icon: MessageCircle, label: "Live Chat Support", description: "Chat with our team", hasNotification: true, count: 1 },
      { icon: Star, label: "Rate Our App", description: "Share your feedback", hasNotification: false }
    ]
  },
  {
    title: "Legal",
    items: [
      { icon: Shield, label: "Privacy Policy", description: "How we protect your data", hasNotification: false },
      { icon: FileText, label: "Terms & Conditions", description: "App usage terms", hasNotification: false },
      { icon: Info, label: "About GoPRO", description: "Version 2.1.0", hasNotification: false }
    ]
  }
];

const userInfo = {
  name: "Ahmed Al-Rashid",
  email: "ahmed@example.com",
  businessName: "Al-Rashid Trading LLC",
  memberSince: "2023",
  avatar: "/placeholder.svg"
};

const quickStats = [
  { label: "Active Services", value: "5", color: "text-brand-blue" },
  { label: "Completed", value: "12", color: "text-brand-green" },
  { label: "In Progress", value: "3", color: "text-brand-orange" }
];

const More = () => {
  const [selectedSection, setSelectedSection] = useState<'Support' | 'Legal' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const userData = {
    user_full_name: userInfo.name,
    company_name: userInfo.businessName,
    email: userInfo.email,
    membership_year: userInfo.memberSince,
    active_services: 5,
    completed_services: 12,
    in_progress_services: 3,
    bookings: 3,
    language_preference: "English"
  };

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action}`);
    // Handle action routing here
  };

  const handleItemClick = (sectionTitle: string, itemLabel: string) => {
    if (sectionTitle === "Support" || sectionTitle === "Legal") {
      setSelectedSection(sectionTitle as 'Support' | 'Legal');
      setSelectedOption(itemLabel);
    } else {
      console.log(`Clicked: ${sectionTitle} - ${itemLabel}`);
      // Handle other menu item clicks
    }
  };

  const handleBackToMenu = () => {
    setSelectedSection(null);
    setSelectedOption(null);
  };

  // Show support assistant if option is selected
  if (selectedSection && selectedOption) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="p-4">
          <SupportAssistant
            selectedSection={selectedSection}
            selectedOption={selectedOption}
            languagePreference={userData.language_preference}
            onBack={handleBackToMenu}
          />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header with User Info */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback className="text-lg">
              {userInfo.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{userInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{userInfo.businessName}</Badge>
              <Badge variant="outline" className="text-xs">Member since {userInfo.memberSince}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Virtual Assistant */}
      <div className="p-4">
        <VirtualAssistant userData={userData} onActionClick={handleActionClick} />
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold text-foreground mb-3">{section.title}</h3>
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center gap-3 p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleItemClick(section.title, item.label)}
                  >
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{item.label}</h4>
                        {item.hasNotification && item.count && (
                          <Badge className="bg-brand-orange text-brand-orange-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {item.count}
                          </Badge>
                        )}
                        {item.hasNotification && !item.count && (
                          <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Emergency Contact */}
        <Card className="border-none shadow-sm bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Emergency Support</h4>
                <p className="text-sm text-red-600">24/7 assistance for urgent matters</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100">
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            GoPRO Business Setup v2.1.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © 2024 GoPRO UAE. All rights reserved.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default More;