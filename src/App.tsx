import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ServiceCategoryDetail from "./pages/ServiceCategoryDetail";
import ApplicationProcess from "./pages/ApplicationProcess";
import CompanyFormationProcess from "./pages/CompanyFormationProcess";
import Community from "./pages/Community";
import Growth from "./pages/Growth";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import BusinessSetupFlow from "./pages/BusinessSetupFlow";
import GrowthServiceDetail from "./pages/GrowthServiceDetail";
import GrowthBooking from "./pages/GrowthBooking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/service/:serviceId" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
            <Route path="/service-category/:categoryId" element={<ProtectedRoute><ServiceCategoryDetail /></ProtectedRoute>} />
            <Route path="/application-process/:categoryId" element={<ProtectedRoute><ApplicationProcess /></ProtectedRoute>} />
            <Route path="/company-formation/:serviceId" element={<ProtectedRoute><CompanyFormationProcess /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
            <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
            <Route path="/business-setup" element={<ProtectedRoute><BusinessSetupFlow /></ProtectedRoute>} />
            <Route path="/growth/service/:serviceId" element={<ProtectedRoute><GrowthServiceDetail /></ProtectedRoute>} />
            <Route path="/growth/booking/:serviceId" element={<ProtectedRoute><GrowthBooking /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
