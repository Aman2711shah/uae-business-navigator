import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Building2, Search, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    icon: Building2,
    title: "Welcome to WAZEET",
    description: "Your trusted partner for UAE business setup and company formation",
    content: "Get started with setting up your business in the UAE with our comprehensive platform designed to make the process simple and efficient."
  },
  {
    icon: Search,
    title: "Start a New Company Setup Easily",
    description: "Simple step-by-step process to register your business",
    content: "Choose from mainland or freezone options, select your business activities, and complete all necessary documentation with our guided process."
  },
  {
    icon: TrendingUp,
    title: "Track Your Request in Real-Time",
    description: "Monitor your application progress every step of the way",
    content: "Stay updated with real-time notifications, document status tracking, and direct communication with our expert team throughout your journey."
  }
];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('wazeet-welcome-shown', 'true');
    }
    onClose();
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" aria-describedby="welcome-slide-description">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">
            {slides[currentSlide].title}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-none shadow-none">
          <CardContent className="text-center space-y-6 p-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CurrentIcon className="h-10 w-10 text-primary" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {slides[currentSlide].description}
              </h3>
              <p id="welcome-slide-description" className="text-muted-foreground leading-relaxed">
                {slides[currentSlide].content}
              </p>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide 
                      ? 'bg-primary' 
                      : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation and controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button 
              onClick={nextSlide}
              size="sm"
              className="flex items-center gap-1"
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              {currentSlide < slides.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label 
              htmlFor="dont-show-again" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't show this again
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};