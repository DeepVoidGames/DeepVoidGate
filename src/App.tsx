import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Technologies from "@/pages/Technologies";
import { GameProvider } from "@/context/GameContext";
import Navbar from "@/components/Navbar";
import Settings from "@/pages/Settings";
import Milestones from "@/pages/Milestones";
import Hub from "@/pages/Hub";
import ExpeditionUI from "@/pages/Expedition";
import ArtifactsDisplay from "@/pages/Artifacts";
import FactionsDisplay from "@/pages/Factions";
import { AuthProvider } from "@/server/AuthContext";
import { ChatProvider } from "@/server/ChatContext";
import { GlobalChat } from "@/components/GlobalChat";
import FactionEventModal from "@/components/FactionEventModal";
import { BASE_NAME } from "@/config";
import Colonization from "@/pages/Colonization";
import BlackHole from "@/pages/BlackHole";
import Analytics from "@/components/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChatProvider>
        <GlobalChat />
        <GameProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={BASE_NAME}>
              <Analytics />
              <Navbar />
              <FactionEventModal />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tech" element={<Technologies />} />
                <Route path="/milestones" element={<Milestones />} />
                <Route path="/hub" element={<Hub />} />
                <Route path="/expedition" element={<ExpeditionUI />} />
                <Route path="/artifacts" element={<ArtifactsDisplay />} />
                <Route path="/factions" element={<FactionsDisplay />} />
                <Route path="/colonization" element={<Colonization />} />
                <Route path="/blackHole" element={<BlackHole />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </GameProvider>
      </ChatProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
