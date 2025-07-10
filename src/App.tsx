import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:serviceId" element={<ServiceDetail />} />
          <Route path="/service-category/:categoryId" element={<ServiceCategoryDetail />} />
          <Route path="/application-process/:categoryId" element={<ApplicationProcess />} />
          <Route path="/company-formation/:serviceId" element={<CompanyFormationProcess />} />
          <Route path="/community" element={<Community />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/more" element={<More />} />
          <Route path="/business-setup" element={<BusinessSetupFlow />} />
          <Route path="/growth/service/:serviceId" element={<GrowthServiceDetail />} />
          <Route path="/growth/booking/:serviceId" element={<GrowthBooking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
