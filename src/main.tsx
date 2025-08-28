import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeProductionSecurity } from '@/lib/production-security'

// Initialize all security measures
initializeProductionSecurity();

createRoot(document.getElementById("root")!).render(<App />);
