import { useState } from "react";
import { 
  ArrowLeft, Phone, MessageCircle, Star, Shield, FileText, Info, ExternalLink, 
  User, Calendar, CreditCard, Upload, Bell, Bookmark, Globe, Edit, Eye,
  CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserData {
  user_full_name: string;
  email: string;
  phone_number: string;
  bookings_count: number;
  invoices_count: number;
  documents_count: number;
  language_preference: string;
}

interface ProfileAssistantProps {
  selectedSection: 'Account' | 'Preferences' | 'Support' | 'Legal' | null;
  selectedOption: string | null;
  userData: UserData;
  onBack: () => void;
}

export const ProfileAssistant = ({ 
  selectedSection, 
  selectedOption, 
  userData, 
  onBack 
}: ProfileAssistantProps) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailUpdates: false,
    smsAlerts: true
  });

  if (!selectedSection || !selectedOption) {
    return null;
  }

  const renderContent = () => {
    switch (selectedOption) {
      // Account Section
      case 'Profile Settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">{userData.user_full_name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email Address</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">{userData.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Phone Number</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">{userData.phone_number}</p>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        );

      case 'My Bookings':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">My Bookings</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{userData.bookings_count}</p>
              <p className="text-sm text-muted-foreground mb-4">
                You currently have {userData.bookings_count} booking{userData.bookings_count !== 1 ? 's' : ''}.
              </p>
            </div>
            <Button className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Booking History
            </Button>
          </div>
        );

      case 'Invoices & Payments':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Invoices & Payments</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">{userData.invoices_count}</p>
              <p className="text-sm text-muted-foreground mb-4">
                You have {userData.invoices_count} invoice{userData.invoices_count !== 1 ? 's' : ''} in your account.
              </p>
            </div>
            <Button className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Payment History
            </Button>
          </div>
        );

      case 'My Documents':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">My Documents</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">{userData.documents_count}</p>
              <p className="text-sm text-muted-foreground mb-4">
                You have uploaded {userData.documents_count} document{userData.documents_count !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Document
              </Button>
            </div>
          </div>
        );

      // Preferences Section
      case 'Notifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch 
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, pushNotifications: checked}))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Updates</p>
                  <p className="text-sm text-muted-foreground">Get updates via email</p>
                </div>
                <Switch 
                  checked={notifications.emailUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailUpdates: checked}))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Urgent updates via SMS</p>
                </div>
                <Switch 
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, smsAlerts: checked}))}
                />
              </div>
            </div>
            <Button className="w-full">Save Preferences</Button>
          </div>
        );

      case 'Saved Services':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Saved Services</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your bookmarked services for quick access.
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Saved Services
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Manage Bookmarks
              </Button>
            </div>
          </div>
        );

      case 'Language Settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Language Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Current Language</Label>
                <Select defaultValue={userData.language_preference.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">🇺🇸 English</SelectItem>
                    <SelectItem value="arabic">🇦🇪 العربية</SelectItem>
                    <SelectItem value="hindi">🇮🇳 हिंदी</SelectItem>
                    <SelectItem value="urdu">🇵🇰 اردو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Language changes will take effect after restarting the app.
                </p>
              </div>
            </div>
            <Button className="w-full">Apply Language Change</Button>
          </div>
        );

      // Support Section (existing cases)
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
                Help us improve by sharing your experience with WAZEET Business Setup.
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

      // Legal Section (existing cases)
      case 'Privacy Policy':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Privacy Policy</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We take your data privacy seriously. Learn how we collect, use, and protect your personal information.
            </p>
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
              View Full Privacy Policy
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
            <p className="text-sm text-muted-foreground mb-4">
              Display brief app terms summary with key points.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Service Usage</h4>
                <p className="text-sm text-muted-foreground">
                  By using WAZEET, you agree to use our services for legitimate business purposes only.
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

      case 'About WAZEET':
        return (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">About WAZEET</h3>
              <p className="text-sm text-muted-foreground mb-4">
                WAZEET Business Setup is your trusted partner for business formation and 
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
                <span className="font-medium">WAZEET UAE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium">Business Services</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 WAZEET UAE. All rights reserved.
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
                Call Now
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
          
          {/* Back to More button */}
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate WAZEET Business Setup</DialogTitle>
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