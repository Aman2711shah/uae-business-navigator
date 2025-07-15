import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ErrorModal } from "@/components/ui/error-modal";
import { useAnalytics } from "@/lib/analytics";

export const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackFeedbackReceived } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMessage("Please log in to submit feedback.");
      setShowErrorModal(true);
      return;
    }

    if (!rating) {
      setErrorMessage("Please select a rating before submitting.");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          rating: parseInt(rating),
          feedback_text: feedbackText.trim() || null
        });

      if (error) {
        console.error('Error submitting feedback:', error);
        setErrorMessage("Failed to submit feedback. Please try again shortly.");
        setShowErrorModal(true);
      } else {
        // Track successful feedback submission
        trackFeedbackReceived(parseInt(rating), "general");
        
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully.",
          variant: "default"
        });
        // Reset form
        setRating("");
        setFeedbackText("");
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage("We're facing a network issue. Please retry shortly.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    "1": "Poor",
    "2": "Fair", 
    "3": "Good",
    "4": "Very Good",
    "5": "Excellent"
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>Share Your Feedback</CardTitle>
          </div>
          <CardDescription>
            Help us improve WAZEET by sharing your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                How would you rate your experience?
              </label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ratingLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < parseInt(value) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="feedback" className="text-sm font-medium mb-2 block">
                Your feedback (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !rating}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        title="Feedback Error"
      />
    </>
  );
};