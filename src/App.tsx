import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnifiedCommandDashboard from "./pages/UnifiedCommandDashboard";
import PremierDashboard from "./pages/PremierDashboard";
import SAPSDashboard from "./pages/SAPSDashboard";
import EMSDashboard from "./pages/EMSDashboard";
import TransportDashboard from "./pages/TransportDashboard";
import HealthDashboard from "./pages/HealthDashboard";
import RoadsAgencyDashboard from "./pages/RoadsAgencyDashboard";
import GovOnboarding from "./pages/GovOnboarding";
import AuthLogin from "./pages/AuthLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UnifiedCommandDashboard />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/premier" element={<PremierDashboard />} />
          <Route path="/saps" element={<SAPSDashboard />} />
          <Route path="/ems" element={<EMSDashboard />} />
          <Route path="/transport" element={<TransportDashboard />} />
          <Route path="/health" element={<HealthDashboard />} />
          <Route path="/roads" element={<RoadsAgencyDashboard />} />
          <Route path="/onboarding" element={<GovOnboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
