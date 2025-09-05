import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeProductionSecurity } from '@/lib/production-security'

// Initialize all security measures
initializeProductionSecurity();

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered: ', registration);

      // Request permissions for advanced PWA features
      await requestPWAPermissions(registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

async function requestPWAPermissions(registration: ServiceWorkerRegistration) {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  // Request periodic background sync permission
  if ('periodicSync' in registration) {
    try {
      await (registration as any).periodicSync.register('content-sync', {
        minInterval: 24 * 60 * 60 * 1000, // 24 hours
      });
    } catch (error) {
      console.log('Periodic sync registration failed:', error);
    }
  }

  // Set up background sync for failed requests
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((swRegistration) => {
      return (swRegistration as any).sync.register('background-sync');
    }).catch((error) => {
      console.log('Background sync registration failed:', error);
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
