import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Package, BookOpen, Heart, Gamepad2, Users, MessageCircle, GraduationCap, BookHeart, Music } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { SplashScreen } from "./components/SplashScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemePreferencesProvider } from "./contexts/ThemePreferencesContext";
import Index from "./pages/Index";
import Oracoes from "./pages/Oracoes";
import Audiofy from "./pages/Audiofy";
import AmigoDivino from "./pages/AmigoDivino";
import Sobre from "./pages/Sobre";
import Games from "./pages/Games";
import GamePlayer from "./pages/games/GamePlayer";
import MemoryPlayer from "./pages/games/MemoryPlayer";
import WordSearchPlayer from "./pages/games/WordSearchPlayer";
import QuizPlayer from "./pages/games/QuizPlayer";
import PuzzlePlayer from "./pages/games/PuzzlePlayer";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
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
import { AnimatedRoutes } from "./components/AnimatedRoutes";

// Plataforma pages
import PlataformaPage from "./pages/plataforma/PlataformaPage";
import CoursePage from "./pages/plataforma/CoursePage";
import ModulePage from "./pages/plataforma/ModulePage";
import LessonPage from "./pages/plataforma/LessonPage";
import CoursesManager from "./pages/admin/plataforma/CoursesManager";
import ModulesManager from "./pages/admin/plataforma/ModulesManager";
import LessonsManager from "./pages/admin/plataforma/LessonsManager";
import MaterialsManager from "./pages/admin/plataforma/MaterialsManager";
import PlatformSettingsManager from "./pages/admin/plataforma/PlatformSettingsManager";
import CarouselsManager from "./pages/admin/plataforma/CarouselsManager";
import PrayersManager from "./pages/admin/PrayersManager";
import ColoringManager from "./pages/admin/ColoringManager";

// Comunidade
import Comunidade from "./pages/Comunidade";

// Colorir pages
import ColorirPage from "./pages/colorir/ColorirPage";
import ColoringEditorPage from "./pages/colorir/ColoringEditorPage";
import PhotoTransformPage from "./pages/colorir/PhotoTransformPage";
import MyCreationsPage from "./pages/colorir/MyCreationsPage";

const queryClient = new QueryClient();

const navItems = [
  { name: 'Início', url: '/', icon: Home },
  { name: 'Orações', url: '/oracoes', icon: BookHeart },
  { name: 'Bíbliafy', url: '/audiofy', icon: Music },
  { name: 'Cursos', url: '/plataforma', icon: GraduationCap },
  { name: 'Guia para Pais', url: '/guia-pais', icon: Users, shortName: 'Guia Pais' },
  { name: 'Games', url: '/games', icon: Gamepad2 }
];

const App = () => {
  // Check if splash was already shown in this session
  const [isLoading, setIsLoading] = useState(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    return !splashShown;
  });

  const handleSplashComplete = () => {
    console.log("Splash completed, setting isLoading to false");
    sessionStorage.setItem('splashShown', 'true');
    setIsLoading(false);
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
      <ThemePreferencesProvider>
        <AuthProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/oracoes" element={<ProtectedRoute><Oracoes /></ProtectedRoute>} />
                <Route path="/audiofy" element={<ProtectedRoute><Audiofy /></ProtectedRoute>} />
                <Route path="/amigodivino" element={<ProtectedRoute><AmigoDivino /></ProtectedRoute>} />
                <Route path="/amigodivino/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                <Route path="/sobre" element={<ProtectedRoute><Sobre /></ProtectedRoute>} />
                <Route path="/guia-pais" element={<ProtectedRoute><GuiaPais /></ProtectedRoute>} />
                <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
                <Route path="/games/:id/play" element={<ProtectedRoute><GamePlayer /></ProtectedRoute>} />
                <Route path="/games/:gameId/memory" element={<ProtectedRoute><MemoryPlayer /></ProtectedRoute>} />
                <Route path="/games/:gameId/wordsearch" element={<ProtectedRoute><WordSearchPlayer /></ProtectedRoute>} />
                <Route path="/games/:gameId/quiz" element={<ProtectedRoute><QuizPlayer /></ProtectedRoute>} />
                <Route path="/games/:gameId/puzzle" element={<ProtectedRoute><PuzzlePlayer /></ProtectedRoute>} />
                <Route path="/biblia" element={<ProtectedRoute><BibliaPage /></ProtectedRoute>} />
                <Route path="/biblia/:bookId" element={<ProtectedRoute><BookChaptersPage /></ProtectedRoute>} />
                <Route path="/biblia/:bookId/:chapterNumber" element={<ProtectedRoute><ChapterReaderPage /></ProtectedRoute>} />
                <Route path="/devocional" element={<ProtectedRoute><DailyDevotionalPage /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/comunidade" element={<ProtectedRoute><Comunidade /></ProtectedRoute>} />
                <Route path="/colorir" element={<ProtectedRoute><ColorirPage /></ProtectedRoute>} />
                <Route path="/colorir/editor/photo" element={<ProtectedRoute><ColoringEditorPage /></ProtectedRoute>} />
                <Route path="/colorir/editor/:drawingId" element={<ProtectedRoute><ColoringEditorPage /></ProtectedRoute>} />
                <Route path="/colorir/transformar" element={<ProtectedRoute><PhotoTransformPage /></ProtectedRoute>} />
                <Route path="/colorir/minhas-criacoes" element={<ProtectedRoute><MyCreationsPage /></ProtectedRoute>} />
                <Route path="/plataforma" element={<ProtectedRoute><PlataformaPage /></ProtectedRoute>} />
                <Route path="/plataforma/curso/:courseId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
                <Route path="/plataforma/modulo/:moduleId" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
                <Route path="/plataforma/aula/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/ebooks" element={<ProtectedRoute requireAdmin><EbooksManager /></ProtectedRoute>} />
                <Route path="/admin/games" element={<ProtectedRoute requireAdmin><GamesManager /></ProtectedRoute>} />
                <Route path="/admin/games/generate" element={<ProtectedRoute requireAdmin><GameGenerator /></ProtectedRoute>} />
                <Route path="/admin/devocionais" element={<ProtectedRoute requireAdmin><DevotionalsManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/configuracoes" element={<ProtectedRoute requireAdmin><PlatformSettingsManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/carrosseis" element={<ProtectedRoute requireAdmin><CarouselsManager /></ProtectedRoute>} />
                <Route path="/admin/oracoes" element={<ProtectedRoute requireAdmin><PrayersManager /></ProtectedRoute>} />
                <Route path="/admin/colorir" element={<ProtectedRoute requireAdmin><ColoringManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/cursos" element={<ProtectedRoute requireAdmin><CoursesManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/modulos" element={<ProtectedRoute requireAdmin><ModulesManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/aulas" element={<ProtectedRoute requireAdmin><LessonsManager /></ProtectedRoute>} />
                <Route path="/admin/plataforma/materiais" element={<ProtectedRoute requireAdmin><MaterialsManager /></ProtectedRoute>} />
                <Route path="/external-login" element={<ExternalFrame url="https://bibliatoonkids.themembers.com.br/login" title="Login - Biblia Toon Kids" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatedRoutes>
              <NavBar items={navItems} />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemePreferencesProvider>
    </QueryClientProvider>
  );
};

export default App;
