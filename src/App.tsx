import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Package, BookOpen, Heart, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import Index from "./pages/Index";
import BoobieGoods from "./pages/BoobieGoods";
import Ebooks from "./pages/Ebooks";
import AmigoDivino from "./pages/AmigoDivino";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";
import { ExternalFrame } from "./components/ExternalFrame";

const queryClient = new QueryClient();

const navItems = [
  { name: 'Início', url: '/', icon: Home },
  { name: 'BoobieGoods', url: '/boobiegoods', icon: Package },
  { name: 'Ebooks', url: '/ebooks', icon: BookOpen },
  { name: 'Amigo Divino', url: '/amigodivino', icon: Heart },
  { name: 'Sobre', url: '/sobre', icon: User }
];

const App = () => (
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
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/external-login" element={<ExternalFrame url="https://bibliatoonkids.themembers.com.br/login" title="Login - Biblia Toon Kids" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <NavBar items={navItems} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
