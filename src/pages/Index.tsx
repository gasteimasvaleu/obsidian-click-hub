import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { RedirectModal } from "@/components/RedirectModal";
import { Package, Palette, BookOpen, Heart, Users, Gamepad2, Info } from "lucide-react";
// Cache refresh fix

const Index = () => {
  const navigate = useNavigate();
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  // Check if user returned from external login
  useEffect(() => {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      // Clear the stored data
      localStorage.removeItem('returnUrl');
      localStorage.removeItem('appState');
    }
  }, []);

  // Card principal
  const mainAction = {
    title: "Acessar Plataforma",
    icon: Package,
    action: () => setShowRedirectModal(true),
    gradient: "from-pink-500 to-purple-500"
  };

  // Cards de navegação
  const navigationActions = [
    { title: "Colorir", icon: Palette, action: () => navigate('/boobiegoods'), gradient: "from-blue-500 to-cyan-500" },
    { title: "Ebooks & Áudio", icon: BookOpen, action: () => navigate('/ebooks'), gradient: "from-green-500 to-emerald-500" },
    { title: "Amigo Divino", icon: Heart, action: () => navigate('/amigodivino'), gradient: "from-red-500 to-pink-500" },
    { title: "Guia para Pais", icon: Users, action: () => navigate('/guia-pais'), gradient: "from-yellow-500 to-orange-500" },
    { title: "Games", icon: Gamepad2, action: () => navigate('/games'), gradient: "from-purple-500 to-indigo-500" },
    { title: "Sobre", icon: Info, action: () => navigate('/sobre'), gradient: "from-teal-500 to-blue-500" }
  ];
  return (
    <div className="min-h-screen bg-black relative flex flex-col pb-24">
      <FuturisticNavbar />
      
      {/* Logo video section */}
      <div className="flex justify-center w-full pt-16 pb-4 px-4">
        <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
          <video 
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_517d0687_1763117222774.mp4"
            className="w-full h-auto"
            style={{ maxHeight: '300px' }}
            autoPlay
            muted
            playsInline
            onEnded={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0;
            }}
          />
        </GlassCard>
      </div>
      
      <div className="flex-1 px-4 pb-8">
        <div className="w-full max-w-4xl mx-auto space-y-4">
          
          {/* Card Principal - Full Width */}
          <GlassCard
            hoverable
            pressable
            onClick={mainAction.action}
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
          >
            <div className={`mb-4 p-5 rounded-full bg-gradient-to-br ${mainAction.gradient} shadow-lg`}>
              <mainAction.icon size={40} className="text-white" />
            </div>
            <span className="text-white text-center font-bold text-lg">
              {mainAction.title}
            </span>
          </GlassCard>

          {/* Grid de Navegação - 2 Colunas */}
          <div className="grid grid-cols-2 gap-4">
            {navigationActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <GlassCard
                  key={index}
                  hoverable
                  pressable
                  onClick={action.action}
                  className="flex flex-col items-center justify-center p-6 min-h-[140px] cursor-pointer"
                >
                  <div className={`mb-3 p-4 rounded-full bg-gradient-to-br ${action.gradient} shadow-lg`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <span className="text-white text-center font-semibold text-sm">
                    {action.title}
                  </span>
                </GlassCard>
              );
            })}
          </div>

        </div>
      </div>
      
      <RedirectModal
        isOpen={showRedirectModal}
        onClose={() => setShowRedirectModal(false)}
        targetUrl="https://bibliatoonkids.themembers.com.br/login"
        title="Biblia Toon Kids"
      />
    </div>
  );
};

export default Index;
