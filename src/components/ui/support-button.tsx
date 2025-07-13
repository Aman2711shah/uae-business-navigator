import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Phone, Mail, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const supportOptions = [
    {
      title: "WhatsApp Chat",
      description: "Quick response via WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      action: () => window.open("https://wa.me/971501234567?text=Hello, I need help with business setup", "_blank"),
      color: "text-green-600"
    },
    {
      title: "Phone Support",
      description: "Call us directly for immediate help",
      icon: <Phone className="h-5 w-5" />,
      action: () => window.open("tel:+971501234567"),
      color: "text-blue-600"
    },
    {
      title: "Email Support",
      description: "Send us detailed questions",
      icon: <Mail className="h-5 w-5" />,
      action: () => window.open("mailto:support@gopro-uae.com?subject=Business Setup Inquiry"),
      color: "text-purple-600"
    }
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Need Help?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Our business setup experts are here to help you every step of the way.
            </p>
            
            {supportOptions.map((option, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={option.action}>
                <div className="flex items-center gap-3">
                  <div className={`${option.color}`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Business Hours:</strong> Sunday - Thursday, 9:00 AM - 6:00 PM GST
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportButton;