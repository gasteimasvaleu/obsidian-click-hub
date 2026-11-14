import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BookOpen, Heart, HandHeart, Music, ArrowRight, Palette, Bot, Users, Gamepad2, MessageCircle } from "lucide-react";
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
    action: () => navigate('/plataforma'),
  };

  const featureActions = [
    { title: "Bíblia Interativa", icon: BookOpen, action: () => navigate('/biblia'), color: "text-feature-bible" },
    { title: "Devocional Diário", icon: Heart, action: () => navigate('/devocional'), color: "text-feature-devotional" },
    { title: "Orações", icon: HandHeart, action: () => navigate('/oracoes'), color: "text-feature-prayer" },
    { title: "Bíbliafy", icon: Music, action: () => navigate('/audiofy'), color: "text-feature-music" },
    { title: "Colorir", icon: Palette, action: () => navigate('/colorir'), color: "text-feature-coloring" },
    { title: "Amigo Divino", icon: Bot, action: () => navigate('/amigodivino'), color: "text-feature-friend" },
    { title: "Guia para Pais", icon: Users, action: () => navigate('/guia-pais'), color: "text-feature-parents" },
    { title: "Games", icon: Gamepad2, action: () => navigate('/games'), color: "text-feature-games" },
    { title: "Comunidade", icon: MessageCircle, action: () => navigate('/comunidade'), color: "text-feature-community" },
  ];

  return (
    <div className="home-light min-h-screen bg-background text-foreground relative flex flex-col pb-24">
      <FuturisticNavbar light />
      <main className="mx-auto w-full max-w-4xl px-4 pt-20 sm:px-6">
        <div className="flex justify-center pb-6">
          <video
            ref={heroVideoRef}
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_517d0687_1763117222774.mp4"
            className="w-full max-w-[500px] max-h-[260px] object-contain"
            autoPlay muted playsInline
            onEnded={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0;
              video.play().catch(() => {});
            }}
          />
        </div>

        <Button
          variant="ghost"
          onClick={mainAction.action}
          className="home-surface relative mb-6 flex h-[100px] w-full justify-between overflow-visible rounded-2xl border border-border bg-card pl-28 pr-5 text-card-foreground hover:bg-secondary"
        >
          <img
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/botaocursos4.png"
            alt=""
            className="pointer-events-none absolute bottom-0 left-2 h-[125px] w-[95px] object-contain"
          />
          <span className="text-base font-bold sm:text-lg">{mainAction.title}</span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <ArrowRight className="!h-5 !w-5" aria-hidden="true" />
          </span>
        </Button>

        {highlights.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-base font-bold">Confira nossos Lançamentos</h2>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3">
                {highlights.map((h: any) => (
                  <Button
                    variant="ghost"
                    key={h.id}
                    className="h-auto flex-[0_0_auto] rounded-lg p-0"
                    onClick={() => h.link_to && navigate(h.link_to)}
                    aria-label={h.title || 'Lançamento'}
                  >
                    <img src={h.image_url} alt={h.title || 'Lançamento'} className="h-[145px] w-[90px] rounded-lg object-cover" />
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3">
          {featureActions.map((action, index) => {
            const Icon = action.icon;
            const isLast = index === featureActions.length - 1;
            return (
              <Button
                key={action.title}
                variant="ghost"
                onClick={action.action}
                aria-label={`Abrir ${action.title}`}
                className={`home-surface group relative flex h-[112px] flex-col items-start justify-between whitespace-normal rounded-2xl border border-border bg-card p-4 text-card-foreground transition-transform hover:bg-card active:scale-[0.98] motion-reduce:transition-none ${isLast ? 'col-span-2 h-[88px] flex-row items-center sm:col-span-3' : ''}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                  <Icon className="!h-7 !w-7" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className={`flex w-full min-w-0 items-center justify-between gap-1 ${isLast ? 'ml-3' : ''}`}>
                  <span className="text-left text-sm font-semibold leading-tight">{action.title}</span>
                  <ArrowRight className="!h-4 !w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </span>
              </Button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
