import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Package, BookOpen, Heart, Gamepad2, Palette } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { SplashScreen } from "./components/SplashScreen";
import { PWAInstallModal } from "./components/PWAInstallModal";
import { usePWAInstall } from "./hooks/usePWAInstall";
import Index from "./pages/Index";
import BoobieGoods from "./pages/BoobieGoods";
import Ebooks from "./pages/Ebooks";
import AmigoDivino from "./pages/AmigoDivino";
import Sobre from "./pages/Sobre";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";
import { ExternalFrame } from "./components/ExternalFrame";
import { ChatInterface } from "./components/ChatInterface";

const queryClient = new QueryClient();

const navItems = [
  { name: 'Início', url: '/', icon: Home },
  { name: 'Colorir', url: '/boobiegoods', icon: Palette },
  { name: 'Ebooks', url: '/ebooks', icon: BookOpen },
  { name: 'Amigo Divino', url: '/amigodivino', icon: Heart },
  { name: 'Games', url: '/games', icon: Gamepad2 }
];

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPWAModal, setShowPWAModal] = useState(false);
  const { isInstallable, shouldShowModal, installPWA, markModalAsSeen } = usePWAInstall();

  const handleSplashComplete = () => {
    console.log("Splash completed, setting isLoading to false");
    setIsLoading(false);
    
    // Show PWA modal after splash if conditions are met
    setTimeout(() => {
      if (shouldShowModal) {
        setShowPWAModal(true);
      }
    }, 500);
  };

  const handlePWAInstall = () => {
    installPWA();
    setShowPWAModal(false);
    markModalAsSeen();
  };

  const handlePWAClose = () => {
    setShowPWAModal(false);
    markModalAsSeen();
  };

  console.log("App rendering, isLoading:", isLoading);

  // Show splash screen first
  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SplashScreen onComplete={handleSplashComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show main app after splash
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/boobiegoods" element={<BoobieGoods />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/amigodivino" element={<AmigoDivino />} />
            <Route path="/amigodivino/chat" element={<ChatInterface />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/games" element={<Games />} />
            <Route path="/external-login" element={<ExternalFrame url="https://bibliatoonkids.themembers.com.br/login" title="Login - Biblia Toon Kids" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NavBar items={navItems} />
        </BrowserRouter>
        
        {/* PWA Install Modal */}
        <PWAInstallModal 
          isOpen={showPWAModal}
          onClose={handlePWAClose}
          onInstall={handlePWAInstall}
          isInstallable={isInstallable}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
