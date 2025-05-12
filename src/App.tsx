
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MarketProvider } from "@/contexts/MarketContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Positions from "./pages/Positions";
import Automation from "./pages/Automation";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Clients from "./pages/Clients";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MarketProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/market" element={
                <AppLayout>
                  <Market />
                </AppLayout>
              } />
              <Route path="/positions" element={
                <AppLayout>
                  <Positions />
                </AppLayout>
              } />
              <Route path="/portfolio" element={
                <AppLayout>
                  <Portfolio />
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } />
              <Route path="/clients" element={
                <AppLayout allowedRoles={["account_manager", "admin", "super_admin"]}>
                  <Clients />
                </AppLayout>
              } />
              <Route path="/automation" element={
                <AppLayout allowedRoles={["account_manager", "admin", "super_admin"]}>
                  <Automation />
                </AppLayout>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MarketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
