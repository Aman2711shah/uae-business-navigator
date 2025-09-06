import { useState } from "react";
import { 
  User, Calendar, FileText, CreditCard, Bell, Bookmark, Globe, 
  HelpCircle, MessageCircle, Star, Shield, Info, ChevronRight, Phone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { Link } from "react-router-dom";

const menuSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile Settings", description: "Edit name, email, and profile", route: "/dashboard" },
      { icon: Calendar, label: "My Bookings", description: "View appointments and consultations", route: "/growth/booking" },
      { icon: CreditCard, label: "Invoices & Payments", description: "Billing history and payments", route: "/services" },
      { icon: FileText, label: "My Documents", description: "Uploaded licenses and documents", route: "/services" }
    ]
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Manage alerts and updates", route: "/dashboard" },
      { icon: Bookmark, label: "Saved Services", description: "Bookmarked services and offers", route: "/services" },
      { icon: Globe, label: "Language Settings", description: "English / العربية", route: "/dashboard" }
    ]
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQs", description: "Get help and find answers", route: "/services" },
      { icon: MessageCircle, label: "Live Chat", description: "Chat with our team", route: "/services" },
      { icon: Star, label: "Feedback", description: "Share your feedback and rate our app", route: "/services" }
    ]
  },
  {
    title: "Legal",
    items: [
      { icon: Shield, label: "Privacy Policy", description: "How we protect your data", route: "/services" },
      { icon: FileText, label: "Terms & Conditions", description: "App usage terms", route: "/services" },
      { icon: Info, label: "About", description: "Version 2.1.0", route: "/services" }
    ]
  }
];

const More = () => {


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">More</h1>
        <p className="text-muted-foreground">Account settings and support</p>
      </div>

      {/* Menu Sections */}
      <div className="p-6 space-y-8">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => (
                  <Link 
                    key={itemIndex}
                    to={item.route}
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Emergency Support - Sticky at bottom */}
      <div className="fixed bottom-20 left-4 right-4 z-10">
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <Button 
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Emergency Support - Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default More;