import { ArrowLeft, Calendar, Clock, User, Mail, Phone, Building, MessageSquare, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

const availableSlots = [
  { date: "Dec 15, 2024", time: "10:00 AM", available: true },
  { date: "Dec 15, 2024", time: "2:00 PM", available: true },
  { date: "Dec 16, 2024", time: "11:00 AM", available: false },
  { date: "Dec 16, 2024", time: "3:00 PM", available: true },
  { date: "Dec 17, 2024", time: "9:00 AM", available: true },
  { date: "Dec 17, 2024", time: "1:00 PM", available: true },
];

const serviceNames = {
  "business-consultancy": "Business Consultancy",
  "digital-marketing": "Digital Marketing",
  "website-development": "Website Development",
  "business-networking": "Business Networking",
  "investor-assistance": "Investor Assistance",
  "business-training": "Business Training"
};

const GrowthBooking = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageType = searchParams.get('package');
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedSlot: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredContact: 'email'
  });

  const serviceName = serviceId ? serviceNames[serviceId as keyof typeof serviceNames] : '';

  const handleSlotSelect = (slot: string) => {
    setFormData({ ...formData, selectedSlot: slot });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // In a real app, this would submit to backend
    setStep(3); // Go to confirmation
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/growth')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-800 mb-2">Consultation Booked Successfully!</h2>
              <p className="text-green-700 mb-4">
                Your consultation for {serviceName} has been confirmed.
              </p>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Date & Time:</strong> {formData.selectedSlot}</p>
                <p><strong>Service:</strong> {serviceName}</p>
                {packageType && <p><strong>Package:</strong> {packageType}</p>}
                <p><strong>Contact:</strong> {formData.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">You'll receive a confirmation email with meeting details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium">Preparation Call</p>
                    <p className="text-sm text-muted-foreground">Our team will call you 24 hours before to prepare</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium">Consultation</p>
                    <p className="text-sm text-muted-foreground">Meet with our expert consultant at the scheduled time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/growth')}>
              Browse More Services
            </Button>
            <Button className="flex-1">
              Add to Calendar
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/growth/service/${serviceId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Book Consultation</h1>
            <p className="text-muted-foreground">{serviceName}</p>
            {packageType && (
              <Badge variant="secondary" className="mt-1">
                {packageType} Package
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? 'bg-brand-orange text-white' : 'bg-muted text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-brand-orange' : 'bg-muted'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? 'bg-brand-orange text-white' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Select Time</span>
          <span>Your Details</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Your Preferred Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      !slot.available 
                        ? 'opacity-50 cursor-not-allowed' 
                        : formData.selectedSlot === `${slot.date} at ${slot.time}`
                          ? 'border-brand-orange bg-orange-50'
                          : 'border-border hover:border-brand-orange/50'
                    }`}
                    onClick={() => slot.available && handleSlotSelect(`${slot.date} at ${slot.time}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{slot.date}</p>
                          <p className="text-sm text-muted-foreground">{slot.time}</p>
                        </div>
                      </div>
                      {!slot.available && (
                        <Badge variant="secondary">Unavailable</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4" 
                disabled={!formData.selectedSlot}
                onClick={() => setStep(2)}
              >
                Continue to Details
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name (optional)"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select 
                    value={formData.preferredContact} 
                    onValueChange={(value) => handleInputChange('preferredContact', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your business needs or any specific questions..."
                    rows={3}
                  />
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Service:</strong> {serviceName}</p>
                    {packageType && <p><strong>Package:</strong> {packageType}</p>}
                    <p><strong>Date & Time:</strong> {formData.selectedSlot}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    disabled={!formData.name || !formData.email || !formData.phone}
                    onClick={handleSubmit}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GrowthBooking;