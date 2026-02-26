import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { Package, Book, Heart, HandHeart, Music, Palette, Users, Gamepad2, MessagesSquare, UserCircle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      localStorage.removeItem('appState');
    }
  }, []);

  const { data: highlights = [] } = useQuery({
    queryKey: ['home_highlights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_highlights' as any)
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data as any[]) || [];
    },
  });

  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const mainAction = {
    title: "Acessar Cursos",
    icon: Package,
    action: () => navigate('/plataforma'),
    gradient: "from-pink-500 to-purple-500"
  };

  const gridActions = [
    { title: "Bíblia Interativa", icon: Book, action: () => navigate('/biblia'), gradient: "from-blue-500 to-indigo-600" },
    { title: "Devocional Diário", icon: Heart, action: () => navigate('/devocional'), gradient: "from-purple-500 to-pink-500" },
    { title: "Orações", icon: HandHeart, action: () => navigate('/oracoes'), gradient: "from-blue-500 to-cyan-500" },
    { title: "Audiofy", icon: Music, action: () => navigate('/audiofy'), gradient: "from-green-500 to-emerald-500" },
    { title: "Colorir", icon: Palette, action: () => navigate('/colorir'), gradient: "from-orange-500 to-yellow-500" },
    { title: "Amigo Divino", icon: Heart, action: () => navigate('/amigodivino'), gradient: "from-red-500 to-pink-500" },
    { title: "Guia para Pais", icon: Users, action: () => navigate('/guia-pais'), gradient: "from-yellow-500 to-orange-500" },
    { title: "Games", icon: Gamepad2, action: () => navigate('/games'), gradient: "from-purple-500 to-indigo-500" },
    { title: "Comunidade", icon: MessagesSquare, action: () => navigate('/comunidade'), gradient: "from-emerald-500 to-teal-500" },
    { title: "Meu Perfil", icon: UserCircle, action: () => navigate('/profile'), gradient: "from-teal-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-black relative flex flex-col pb-24">
      <FuturisticNavbar />
      
      <div className="flex justify-center w-full pt-12 pb-4 px-4">
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
        <div className="w-full max-w-4xl mx-auto space-y-6">
          
          {/* Card Principal - Full Width */}
          <GlassCard
              hoverable
              pressable
              onClick={mainAction.action}
              className="relative h-[100px] pl-[80px] pr-4 flex items-center cursor-pointer"
              style={{ clipPath: 'inset(-35px 0 0 0 round 0 0 1rem 1rem)' }}
            >
              <img
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/botaocursos4.png"
                alt="Acessar Cursos"
                className="absolute left-2 bottom-0 h-[130px] w-auto object-contain pointer-events-none z-10"
              />
              <span className="text-white font-bold text-base text-center w-full">{mainAction.title}</span>
            </GlassCard>

          {/* Grid de Cards - 2 Colunas */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {gridActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <GlassCard
                    key={index}
                    hoverable
                    pressable
                    onClick={action.action}
                    className="h-[80px] px-4 flex items-center gap-3 cursor-pointer"
                  >
                    <div className={`w-12 h-12 min-w-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm leading-tight">
                      {action.title}
                    </span>
                  </GlassCard>
              );
            })}
          </div>

          {/* Carrossel de Lançamentos */}
          {highlights.length > 0 && (
            <>
              <GlassCard className="h-[50px] flex items-center justify-center gap-2 p-0">
                <Sparkles size={18} className="text-primary" />
                <span className="text-white font-bold text-sm">Confira nossos Lançamentos</span>
              </GlassCard>

              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3">
                  {highlights.map((h: any) => (
                    <div
                      key={h.id}
                      className="flex-[0_0_auto] cursor-pointer"
                      onClick={() => h.link_to && navigate(h.link_to)}
                    >
                      <img
                        src={h.image_url}
                        alt={h.title || 'Lançamento'}
                        className="w-[75px] h-[145px] rounded-xl object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      
    </div>
  );
};

export default Index;
