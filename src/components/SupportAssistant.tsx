import { useState } from "react";
import { ArrowLeft, Phone, MessageCircle, Star, Shield, FileText, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SupportAssistantProps {
  selectedSection: 'Support' | 'Legal' | null;
  selectedOption: string | null;
  languagePreference: string;
  onBack: () => void;
}

export const SupportAssistant = ({ 
  selectedSection, 
  selectedOption, 
  languagePreference, 
  onBack 
}: SupportAssistantProps) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  if (!selectedSection || !selectedOption) {
    return null;
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 'Help & FAQs':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {[
                "How do I book a consultation?",
                "How can I update my profile?",
                "How do I track my service progress?",
                "How can I download my invoices?",
                "What happens if I miss a booking?"
              ].map((question, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-l-primary">
                  <p className="text-sm font-medium text-foreground">{index + 1}. {question}</p>
                </div>
              ))}
            </div>
            <Button className="w-full" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full FAQ
            </Button>
          </div>
        );

      case 'Live Chat Support':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Live Chat Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with our support team instantly. We're here to help with any questions or issues.
              </p>
              <Badge className="bg-green-100 text-green-800 mb-4">
                • Online - Average response time: 2 minutes
              </Badge>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
          </div>
        );

      case 'Rate Our App':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Rate Our App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help us improve by sharing your experience with GoPRO Business Setup.
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setShowRatingDialog(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Leave a Rating
            </Button>
          </div>
        );

      case 'Privacy Policy':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Privacy Policy</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
                <p className="text-sm text-blue-700">
                  We use industry-standard encryption to protect your personal and business information.
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Information Usage</h4>
                <p className="text-sm text-green-700">
                  Your data is only used to provide services and improve your experience.
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Third-Party Sharing</h4>
                <p className="text-sm text-purple-700">
                  We never sell your data. Sharing is limited to service providers only when necessary.
                </p>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Full Privacy Policy
            </Button>
          </div>
        );

      case 'Terms & Conditions':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Terms & Conditions</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Service Usage</h4>
                <p className="text-sm text-muted-foreground">
                  By using GoPRO, you agree to use our services for legitimate business purposes only.
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Payment Terms</h4>
                <p className="text-sm text-muted-foreground">
                  All fees are due upon service completion unless otherwise agreed in writing.
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Liability</h4>
                <p className="text-sm text-muted-foreground">
                  We provide services with due care but cannot guarantee specific outcomes.
                </p>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Full Terms & Conditions
            </Button>
          </div>
        );

      case 'About GoPRO':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">About GoPRO</h3>
              <p className="text-sm text-muted-foreground mb-4">
                GoPRO Business Setup is your trusted partner for business formation and 
                government services in the UAE.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">GoPRO UAE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium">Business Services</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 GoPRO UAE. All rights reserved.
            </p>
          </div>
        );

      case 'Emergency Support':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Emergency Support</h3>
              <p className="text-sm text-red-600 mb-4">
                For urgent business matters that require immediate assistance. 
                Available 24/7 for critical issues.
              </p>
              <Badge className="bg-red-100 text-red-800 mb-4">
                🔴 Available 24/7
              </Badge>
            </div>
            <div className="space-y-2">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Support
              </Button>
              <p className="text-xs text-red-600">
                +971-XX-XXX-XXXX
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">{selectedOption}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate GoPRO Business Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              How would you rate your experience with our app?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRating(rating)}
                  className="p-2"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      rating <= selectedRating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </Button>
              ))}
            </div>
            {selectedRating > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Thank you for rating us {selectedRating} star{selectedRating > 1 ? 's' : ''}!
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => setShowRatingDialog(false)}
                >
                  Submit Rating
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};