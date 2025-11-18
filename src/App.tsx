import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Package, BookOpen, Heart, Gamepad2, Palette, Users, MessageCircle } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { SplashScreen } from "./components/SplashScreen";
import { PWAInstallModal } from "./components/PWAInstallModal";
import { usePWAInstall } from "./hooks/usePWAInstall";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import BoobieGoods from "./pages/BoobieGoods";
import Ebooks from "./pages/Ebooks";
import AmigoDivino from "./pages/AmigoDivino";
import Sobre from "./pages/Sobre";
import Games from "./pages/Games";
import GamePlayer from "./pages/games/GamePlayer";
import MemoryPlayer from "./pages/games/MemoryPlayer";
import WordSearchPlayer from "./pages/games/WordSearchPlayer";
import QuizPlayer from "./pages/games/QuizPlayer";
import PuzzlePlayer from "./pages/games/PuzzlePlayer";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import EbooksManager from "./pages/admin/EbooksManager";
import GamesManager from "./pages/admin/GamesManager";
import GameGenerator from "./pages/admin/GameGenerator";
import BibliaPage from "./pages/biblia/BibliaPage";
import BookChaptersPage from "./pages/biblia/BookChaptersPage";
import ChapterReaderPage from "./pages/biblia/ChapterReaderPage";
import DailyDevotionalPage from "./pages/devocional/DailyDevotionalPage";
import DevotionalsManager from "./pages/admin/DevotionalsManager";
import GuiaPais from "./pages/GuiaPais";
import NotFound from "./pages/NotFound";
import { ExternalFrame } from "./components/ExternalFrame";
import { ChatInterface } from "./components/ChatInterface";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const navItems = [
  { name: 'Início', url: '/', icon: Home },
  { name: 'Colorir', url: '/boobiegoods', icon: Palette },
  { name: 'Mídia', url: '/ebooks', icon: BookOpen },
  { name: 'Chat', url: '/amigodivino', icon: MessageCircle },
  { name: 'Guia', url: '/guia-pais', icon: Users },
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
      <AuthProvider>
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
              <Route path="/guia-pais" element={<GuiaPais />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:id/play" element={<GamePlayer />} />
              <Route path="/games/:gameId/memory" element={<MemoryPlayer />} />
              <Route path="/games/:gameId/wordsearch" element={<WordSearchPlayer />} />
              <Route path="/games/:gameId/quiz" element={<QuizPlayer />} />
              <Route path="/games/:gameId/puzzle" element={<PuzzlePlayer />} />
              <Route path="/biblia" element={<BibliaPage />} />
              <Route path="/biblia/:bookId" element={<BookChaptersPage />} />
              <Route path="/biblia/:bookId/:chapterNumber" element={<ChapterReaderPage />} />
              <Route path="/devocional" element={<DailyDevotionalPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/ebooks" element={<ProtectedRoute requireAdmin><EbooksManager /></ProtectedRoute>} />
              <Route path="/admin/games" element={<ProtectedRoute requireAdmin><GamesManager /></ProtectedRoute>} />
              <Route path="/admin/games/generate" element={<ProtectedRoute requireAdmin><GameGenerator /></ProtectedRoute>} />
              <Route path="/admin/devocionais" element={<ProtectedRoute requireAdmin><DevotionalsManager /></ProtectedRoute>} />
              <Route path="/external-login" element={<ExternalFrame url="https://bibliatoonkids.themembers.com.br/login" title="Login - Biblia Toon Kids" />} />
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
