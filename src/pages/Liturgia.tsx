import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { BubbleSection, SPLIT_BAR } from "@/components/ui/bubble-section";
import { BackArrowButton, ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { GlassCard } from "@/components/GlassCard";
import liturgiaTopoVideo from "@/assets/liturgia/liturgia-topo.mp4.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { colorSwatch, isoDate, normalizeReadings, shiftDate } from "@/lib/liturgia/normalize";

const today = isoDate(new Date());

const Liturgia = () => {
  const [date, setDate] = useState(today);
  const [tab, setTab] = useState("evangelho");
  const { data, isLoading, error } = useQuery({
    queryKey: ["liturgia", date],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const { data: cached } = await supabase.from("daily_liturgy" as any).select("*").eq("date", date).maybeSingle();
      if ((cached as any)?.reflection) return cached as any;
      const { data, error } = await supabase.functions.invoke("daily-liturgy", { body: { date } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });
  const readings = normalizeReadings(data?.readings);
  const current = readings.find((r) => r.key === tab) ?? readings[readings.length - 1];
  const daysFromToday = Math.round((new Date(`${date}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000);
  const label = new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-background relative">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-16 pb-32 max-w-[58rem]">
        <div className="mb-4"><BackArrowButton to="/" label="Voltar" /></div>
        <GlassCard className="mb-6 w-full overflow-hidden p-0">
          <video src={liturgiaTopoVideo.url} className="aspect-video h-auto w-full object-cover" autoPlay muted playsInline
            onError={(e) => (e.target as HTMLVideoElement).parentElement?.classList.add("hidden")} />
        </GlassCard>
        <SectionHeader title="Liturgia Diária" description="As leituras da Missa de cada dia" />

        <div className="mb-4 flex items-center justify-between">
          <ArrowNavButton direction="left" label="Dia anterior" disabled={daysFromToday <= -7} onClick={() => setDate(shiftDate(date, -1))} />
          <ArrowNavButton direction="right" label="Próximo dia" disabled={daysFromToday >= 7} onClick={() => setDate(shiftDate(date, 1))} />
        </div>

        <div className="mb-6">
          <BubbleSection title="Dia">
            <div className="text-center">
              <p className="text-sm font-semibold capitalize text-muted-foreground">{label}</p>
              {data && (
                <p className="mt-1 flex items-center justify-center gap-2 font-bold text-foreground">
                  <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-border" style={{ background: colorSwatch(data.color) }} aria-label={`Cor ${data.color}`} />
                  {data.title}
                </p>
              )}
            </div>
          </BubbleSection>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
        ) : error || !current ? (
          <p className="py-12 text-center text-muted-foreground">{(error as Error)?.message || "Liturgia indisponível para este dia."}</p>
        ) : (
          <>
            <div className={`${SPLIT_BAR} mb-6`} role="tablist">
              {readings.map((r) => (
                <button key={r.key} type="button" role="tab" aria-selected={current.key === r.key} onClick={() => setTab(r.key)}
                  className={`flex flex-1 items-center justify-center py-3 text-xs font-semibold transition-colors sm:text-sm ${current.key === r.key ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                  {r.tab}
                </button>
              ))}
            </div>
            <BubbleSection title={current.tab}>
              <p className="text-sm font-semibold text-primary">{current.referencia}</p>
              {current.titulo && <h3 className="mb-3 text-lg font-bold text-foreground">{current.titulo}</h3>}
              {current.refrao && <p className="mb-4 rounded-xl bg-primary/10 p-3 font-semibold text-foreground">R. {current.refrao}</p>}
              <p className="whitespace-pre-line leading-relaxed text-foreground/90">{current.texto}</p>
            </BubbleSection>
            {data.reflection && (
              <BubbleSection title="Reflexão para a Família">
                <p className="whitespace-pre-line leading-relaxed text-foreground/90">{data.reflection}</p>
              </BubbleSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Liturgia;
