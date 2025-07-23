import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyClientSecurityHeaders } from '@/lib/csp'

// Apply security headers immediately
applyClientSecurityHeaders();

createRoot(document.getElementById("root")!).render(<App />);
