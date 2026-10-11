import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BookOpen, Heart, HandHeart, Music, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const navigate = useNavigate();
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      localStorage.removeItem('appState');
    }
  }, []);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const onTap = () => { tryPlay(); };
    document.addEventListener('touchstart', onTap, { once: true, passive: true });
    return () => document.removeEventListener('touchstart', onTap);
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

  const featureActions = [
    { title: "Bíblia Interativa", icon: BookOpen, action: () => navigate('/biblia'), color: "bg-feature-bible", tags: ["73 livros", "Leitura"] },
    { title: "Devocional Diário", icon: Heart, action: () => navigate('/devocional'), color: "bg-feature-devotional", tags: ["Reflexão", "Palavra do dia"] },
    { title: "Orações", icon: HandHeart, action: () => navigate('/oracoes'), color: "bg-feature-prayer", tags: ["Categorias", "Favoritas"] },
    { title: "Bíbliafy", icon: Music, action: () => navigate('/audiofy'), color: "bg-feature-music", tags: ["Músicas", "Histórias"] },
  ];

  return (
    <div className="min-h-screen bg-black relative flex flex-col pb-24">
      <FuturisticNavbar />
      
      <div className="flex justify-center w-full pt-16 pb-4 px-4">
        <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
          <video 
            ref={heroVideoRef}
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_517d0687_1763117222774.mp4"
            className="w-full h-auto"
            style={{ maxHeight: '300px' }}
            autoPlay
            muted
            playsInline
            // @ts-ignore - iOS WKWebView legacy attribute
            webkit-playsinline=""
            onEnded={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0;
              video.play().catch(() => {});
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

          {/* Atalhos principais */}
          <div className="overflow-hidden rounded-2xl">
            {featureActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.action}
                  className={`${action.color} relative flex h-[144px] w-full items-start text-feature-foreground transition-transform duration-200 active:scale-[0.98] ${index > 0 ? "-mt-5" : ""} rounded-t-2xl px-6 pb-6 pt-7 text-left`}
                  style={{ zIndex: index + 1 }}
                  aria-label={`Abrir ${action.title}`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <Icon size={28} strokeWidth={2.2} aria-hidden="true" />
                      <span className="truncate text-xl font-bold">{action.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {action.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-feature-foreground/60 px-3 py-1 text-xs font-semibold leading-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="ml-4 mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-feature-action text-feature-foreground">
                    <ArrowRight size={28} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Link Política de Famílias */}
          <div
            onClick={() => navigate('/politica-familia')}
            className="flex items-center justify-center gap-2 cursor-pointer py-3"
          >
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-muted-foreground text-xs underline">Política de Famílias e Privacidade</span>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Index;
