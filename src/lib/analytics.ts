// Google Analytics integration for WAZEET business setup application

interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

class Analytics {
  private gaId: string | null = null;

  constructor() {
    // Initialize Google Analytics
    this.init();
  }

  private init() {
    // Check if GA4 Tracking ID is set in environment or localStorage
    this.gaId = localStorage.getItem('ga4-tracking-id') || null;
    
    if (this.gaId && typeof window !== 'undefined') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      
      gtag('js', new Date());
      gtag('config', this.gaId);
      
      // Make gtag available globally
      (window as any).gtag = gtag;
    }
  }

  // Set GA4 Tracking ID
  setTrackingId(trackingId: string) {
    this.gaId = trackingId;
    localStorage.setItem('ga4-tracking-id', trackingId);
    this.init();
  }

  // Track custom events
  track(eventName: string, parameters?: Record<string, any>) {
    if (!this.gaId || typeof window === 'undefined') {
      // Analytics tracking (offline): eventName, parameters
      return;
    }

    try {
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', eventName, {
          custom_parameter: true,
          ...parameters
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Predefined tracking methods for WAZEET events
  trackApplicationStarted(applicationType: string, freezone?: string) {
    this.track('Application_Started', {
      application_type: applicationType,
      freezone: freezone,
      timestamp: Date.now()
    });
  }

  trackApplicationSubmitted(applicationId: string, applicationType: string) {
    this.track('Application_Submitted', {
      application_id: applicationId,
      application_type: applicationType,
      timestamp: Date.now()
    });
  }

  trackDocumentUploaded(documentType: string, applicationId?: string) {
    this.track('Document_Uploaded', {
      document_type: documentType,
      application_id: applicationId,
      timestamp: Date.now()
    });
  }

  trackFeedbackReceived(rating: number, category: string) {
    this.track('Feedback_Received', {
      rating: rating,
      category: category,
      timestamp: Date.now()
    });
  }

  // Track page views
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.gaId || typeof window === 'undefined') {
      // Analytics page view (offline): pagePath, pageTitle
      return;
    }

    try {
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('config', this.gaId, {
          page_path: pagePath,
          page_title: pageTitle
        });
      }
    } catch (error) {
      console.error('Analytics page view error:', error);
    }
  }

  // Track user interactions
  trackUserInteraction(interactionType: string, details: Record<string, any>) {
    this.track('user_interaction', {
      interaction_type: interactionType,
      ...details
    });
  }

  // Track errors for debugging
  trackError(errorMessage: string, errorCode?: string, page?: string) {
    this.track('error_occurred', {
      error_message: errorMessage,
      error_code: errorCode,
      page: page,
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Hook for React components to use analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackApplicationStarted: analytics.trackApplicationStarted.bind(analytics),
    trackApplicationSubmitted: analytics.trackApplicationSubmitted.bind(analytics), 
    trackDocumentUploaded: analytics.trackDocumentUploaded.bind(analytics),
    trackFeedbackReceived: analytics.trackFeedbackReceived.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackUserInteraction: analytics.trackUserInteraction.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setTrackingId: analytics.setTrackingId.bind(analytics)
  };
};