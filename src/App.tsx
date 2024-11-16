import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/booking/:agentId" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;