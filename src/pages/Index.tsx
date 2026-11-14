import homeVideo from "@/assets/home_intro_video.mp4.asset.json";
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
    { title: "Bíblia Interativa", icon: BookOpen, action: () => navigate('/biblia'), color: "bg-feature-bible/75" },
    { title: "Devocional Diário", icon: Heart, action: () => navigate('/devocional'), color: "bg-feature-devotional/75" },
    { title: "Orações", icon: HandHeart, action: () => navigate('/oracoes'), color: "bg-feature-prayer/75" },
    { title: "Bíbliafy", icon: Music, action: () => navigate('/audiofy'), color: "bg-feature-music/75" },
    { title: "Colorir", icon: Palette, action: () => navigate('/colorir'), color: "bg-feature-coloring/75" },
    { title: "Amigo Divino", icon: Bot, action: () => navigate('/amigodivino'), color: "bg-feature-friend/75" },
    { title: "Guia para Pais", icon: Users, action: () => navigate('/guia-pais'), color: "bg-feature-parents/75" },
    { title: "Games", icon: Gamepad2, action: () => navigate('/games'), color: "bg-feature-games/75" },
    { title: "Comunidade", icon: MessageCircle, action: () => navigate('/comunidade'), color: "bg-feature-community/75" },
  ];

  return (
    <div className="home-light min-h-screen bg-background text-foreground relative flex flex-col pb-24">
      <FuturisticNavbar light />
      <main className="mx-auto w-full max-w-4xl px-4 pt-20 sm:px-6">
        <div className="flex justify-center pb-6">
          <div className="neon-glow-user relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-card">
          <span aria-hidden className="border-beam" />
          <video
            ref={heroVideoRef}
            src={homeVideo.url}
            className="block w-full max-h-[260px] object-contain"
            autoPlay muted playsInline
            onEnded={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0;
              video.play().catch(() => {});
            }}
          />
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={mainAction.action}
          className="neon-glow-user feature-bubble bubble-user relative mb-6 flex h-[100px] w-full justify-between overflow-visible rounded-2xl pl-28 pr-5 text-feature-foreground hover:bg-transparent hover:text-feature-foreground"
        >
          <span aria-hidden className="border-beam" />
          <img
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/botaocursos4.png"
            alt=""
            className="pointer-events-none absolute bottom-0 left-2 h-[125px] w-[95px] object-contain object-bottom"
          />
          <span className="flex-1 text-center text-base font-bold sm:text-lg">{mainAction.title}</span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-feature-foreground/40 bg-feature-foreground/20 text-feature-foreground backdrop-blur">
            <ArrowRight className="!h-5 !w-5" aria-hidden="true" />
          </span>
        </Button>

        {highlights.length > 0 && (
          <section className="mb-6">
            <div className="neon-glow-user feature-bubble bubble-user relative mb-3 flex h-[50px] items-center justify-center rounded-2xl text-feature-foreground">
              <span aria-hidden className="border-beam" />
              <h2 className="text-sm font-bold">Confira nossos Lançamentos</h2>
            </div>
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

        <div className="-mx-4 overflow-hidden rounded-t-2xl sm:mx-0">
          {featureActions.map((action, index) => {
            const Icon = action.icon;
            const isLast = index === featureActions.length - 1;
            return (
              <button
                key={action.title}
                type="button"
                onClick={action.action}
                className={`${action.color} feature-bubble relative overflow-hidden ${isLast ? "min-h-[150px] items-start" : "h-[88px] items-center"} flex w-full text-feature-foreground transition-transform duration-200 active:scale-[0.98] ${index > 0 ? "-mt-4" : ""} rounded-t-2xl px-6 py-5 text-left`}
                style={{ zIndex: index + 1 }}
                aria-label={`Abrir ${action.title}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 animate-shine motion-reduce:animate-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                    animationDelay: `${1.2 + index * 0.5}s`,
                  }}
                />
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon size={26} strokeWidth={2.2} aria-hidden="true" />
                  <span className="truncate text-lg font-bold">{action.title}</span>
                </div>
                <span className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-feature-foreground/40 bg-feature-foreground/20 text-feature-foreground backdrop-blur">
                  <ArrowRight size={24} aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
