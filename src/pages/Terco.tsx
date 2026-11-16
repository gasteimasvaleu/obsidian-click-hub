import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Volume2, VolumeX, RotateCcw, Loader2 } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { BubbleSection, SPLIT_BAR } from "@/components/ui/bubble-section";
import { BackArrowButton } from "@/components/plataforma/BackArrowButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MYSTERIES, MYSTERY_SET_NAMES, PRAYERS, mysteryForDay } from "@/lib/terco/data";
import { SEQUENCE } from "@/lib/terco/sequence";
import { toast } from "sonner";

const RosaryScene = lazy(() => import("@/components/terco/RosaryScene"));

const todayKey = () => new Date().toLocaleDateString("sv-SE");

const Terco = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const set = mysteryForDay(new Date().getDay());
  const storageKey = `terco-progress-${todayKey()}-${set}`;
  const [step, setStep] = useState<number>(() => Number(localStorage.getItem(storageKey) || 0));
  const [finished, setFinished] = useState(false);
  const [audioOn, setAudioOn] = useState(() => localStorage.getItem("terco-audio") === "1");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cur = SEQUENCE[step];
  const decadeMystery = cur.decade !== null ? MYSTERIES[set][cur.decade] : null;
  const doneBeads = useMemo(() => new Set(SEQUENCE.slice(0, step).map((s) => s.bead)), [step]);

  useEffect(() => { localStorage.setItem(storageKey, String(step)); }, [step, storageKey]);
  useEffect(() => { localStorage.setItem("terco-audio", audioOn ? "1" : "0"); }, [audioOn]);

  // Áudio narrado
  useEffect(() => {
    audioRef.current?.pause();
    if (!audioOn || finished) return;
    const files = [
      ...(cur.announce && cur.decade !== null ? [`m-${set}-${cur.decade + 1}`] : []),
      ...cur.prayers.map((p) => `p-${p}`),
    ];
    let i = 0; let cancelled = false;
    const a = new Audio(); audioRef.current = a;
    const playNext = () => { if (cancelled || i >= files.length) return; a.src = `/terco/${files[i++]}.mp3`; a.play().catch(() => {}); };
    a.onended = playNext; playNext();
    return () => { cancelled = true; a.pause(); };
  }, [step, audioOn, finished, set]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: history = [] } = useQuery({
    queryKey: ["rosary_sessions", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("rosary_sessions" as any).select("*").eq("user_id", user!.id).order("completed_at", { ascending: false }).limit(60);
      if (error) throw error; return (data as any[]) || [];
    },
  });

  const streak = useMemo(() => {
    const days = new Set(history.map((h: any) => new Date(h.completed_at).toLocaleDateString("sv-SE")));
    let n = 0; const d = new Date();
    if (!days.has(d.toLocaleDateString("sv-SE"))) d.setDate(d.getDate() - 1);
    while (days.has(d.toLocaleDateString("sv-SE"))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }, [history]);

  const complete = async () => {
    setFinished(true);
    localStorage.removeItem(storageKey);
    if (user) {
      const { error } = await supabase.from("rosary_sessions" as any).insert({ user_id: user.id, mystery_set: set } as any);
      if (error) toast.error("Não foi possível salvar no histórico");
      qc.invalidateQueries({ queryKey: ["rosary_sessions"] });
    }
  };

  const onTapBead = (bead: number) => {
    if (finished || bead !== cur.bead) return;
    if (step === SEQUENCE.length - 1) complete(); else setStep(step + 1);
  };
  const restart = () => { setStep(0); setFinished(false); };

  const label = finished ? "Terço concluído"
    : cur.decade !== null ? `Dezena ${cur.decade + 1} de 5${cur.ave ? ` · Ave-Maria ${cur.ave} de 10` : ""}`
    : step === SEQUENCE.length - 1 ? "Oração final" : "Orações iniciais";

  return (
    <div className="min-h-screen bg-background relative">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-16 pb-32 max-w-[58rem]">
        <div className="mb-4"><BackArrowButton to="/oracoes" label="Voltar" /></div>
        <SectionHeader title="Santo Terço" description={`Hoje: ${MYSTERY_SET_NAMES[set]}`} />

        <GlassCard className="relative mb-4 overflow-hidden p-0">
          <div className="relative h-[380px] w-full sm:h-[460px]">
            <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
              <RosaryScene currentBead={cur.bead} doneBeads={finished ? new Set(SEQUENCE.map((s) => s.bead)) : doneBeads} onTapBead={onTapBead} />
            </Suspense>
          </div>
          <div className="border-t border-border px-4 py-3">
            <div className="mb-1 flex justify-between text-sm font-semibold text-foreground"><span>{label}</span><span>{Math.round(((finished ? SEQUENCE.length : step) / SEQUENCE.length) * 100)}%</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((finished ? SEQUENCE.length : step) / SEQUENCE.length) * 100}%` }} />
            </div>
            {!finished && <p className="mt-2 text-center text-xs text-muted-foreground">Toque na conta que está brilhando para avançar. Arraste para girar o terço.</p>}
          </div>
        </GlassCard>

        <div className={`${SPLIT_BAR} mb-6`}>
          <button type="button" onClick={() => setAudioOn(!audioOn)} className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-foreground">
            {audioOn ? <Volume2 size={18} /> : <VolumeX size={18} />} {audioOn ? "Narração ligada" : "Narração desligada"}
          </button>
          <button type="button" onClick={restart} className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-foreground">
            <RotateCcw size={18} /> Recomeçar
          </button>
        </div>

        {finished ? (
          <BubbleSection title="Terço concluído">
            <p className="text-center text-foreground">Parabéns! Você rezou os {MYSTERY_SET_NAMES[set]}. Que Nossa Senhora abençoe você e sua família.</p>
            {streak > 0 && <p className="mt-2 text-center font-semibold text-primary">{streak} {streak === 1 ? "dia seguido" : "dias seguidos"} rezando o terço</p>}
          </BubbleSection>
        ) : (
          <>
            {cur.announce && decadeMystery && (
              <BubbleSection title={`${(cur.decade ?? 0) + 1}º Mistério`}>
                <h3 className="text-lg font-bold text-foreground">{decadeMystery.title}</h3>
                <p className="mb-2 text-sm font-semibold text-primary">{decadeMystery.ref}</p>
                <p className="text-foreground/80">{decadeMystery.meditation}</p>
              </BubbleSection>
            )}
            {cur.prayers.map((p, i) => (
              <BubbleSection key={`${step}-${i}`} title={PRAYERS[p].title}>
                <p className="leading-relaxed text-foreground/90">{PRAYERS[p].text}</p>
              </BubbleSection>
            ))}
            {!cur.announce && decadeMystery && (
              <p className="mb-6 text-center text-sm text-muted-foreground">Meditando: {decadeMystery.title}</p>
            )}
          </>
        )}

        <BubbleSection title="Meu histórico">
          {streak > 0 && <p className="mb-3 font-semibold text-primary">{streak} {streak === 1 ? "dia seguido" : "dias seguidos"}</p>}
          {history.length === 0 ? <p className="text-muted-foreground">Você ainda não concluiu nenhum terço.</p> : (
            <ul className="divide-y divide-border">
              {history.slice(0, 10).map((h: any) => (
                <li key={h.id} className="flex justify-between py-2 text-sm">
                  <span className="text-foreground">{MYSTERY_SET_NAMES[h.mystery_set as keyof typeof MYSTERY_SET_NAMES] ?? h.mystery_set}</span>
                  <span className="text-muted-foreground">{new Date(h.completed_at).toLocaleDateString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          )}
        </BubbleSection>
      </div>
    </div>
  );
};
export default Terco;
