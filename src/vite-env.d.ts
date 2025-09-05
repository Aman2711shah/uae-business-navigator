/// <reference types="vite/client" />

// Stripe global type declaration
declare global {
  interface Window {
    Stripe: (publishableKey: string) => {
      redirectToCheckout: (options: { sessionId: string }) => Promise<void>;
    };
  }
}
