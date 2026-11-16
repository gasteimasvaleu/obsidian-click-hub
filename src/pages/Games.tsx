import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { GameCardSkeleton } from "@/components/skeletons/GameCardSkeleton";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gamepad2, Brain, Grid3x3, Search, Puzzle, X } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import quizImg from "@/assets/games/quiz.png";
import memoryImg from "@/assets/games/memory.png";
import wordsearchImg from "@/assets/games/wordsearch.png";
import puzzleImg from "@/assets/games/puzzle.png";
import gamesTopoVideo from "@/assets/games/games-topo.mp4.asset.json";

const TYPE_IMAGES: Record<string, string> = { quiz: quizImg, memory: memoryImg, wordsearch: wordsearchImg, puzzle: puzzleImg };
const TYPE_LABELS: Record<string, string> = { quiz: "Quiz", memory: "Memória", wordsearch: "Caça-palavras", puzzle: "Quebra-cabeça" };
const DIFF_STYLES: Record<string, string> = {
  "Fácil": "bg-success/10 text-success",
  "Médio": "bg-warning/10 text-warning",
  "Difícil": "bg-destructive/10 text-destructive",
};
const displayTitle = (t: string) => t.replace(/\bQuizz\b/g, "Quiz");

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  available: boolean;
  icon_name: string;
  color: string;
}

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar jogos');
      console.error(error);
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  const difficultyColors = {
    Fácil: "bg-primary/20 text-primary border-primary/40",
    Médio: "bg-blue-500/20 text-blue-400 border-blue-400/40",
    Difícil: "bg-red-500/20 text-red-400 border-red-400/40",
  };

  const gameTypes = [
    { value: "all", label: "Todos", icon: Gamepad2 },
    { value: "quiz", label: "Quiz", icon: Brain },
    { value: "memory", label: "Memória", icon: Grid3x3 },
    { value: "wordsearch", label: "Caça-palavras", icon: Search },
    { value: "puzzle", label: "Quebra-cabeça", icon: Puzzle },
  ];

  const difficulties = [
    { value: "all", label: "Todas", color: "text-foreground" },
    { value: "Fácil", label: "Fácil", color: "text-primary" },
    { value: "Médio", label: "Médio", color: "text-blue-400" },
    { value: "Difícil", label: "Difícil", color: "text-red-400" },
  ];

  const filteredGames = games.filter((game) => {
    const typeMatch = selectedType === "all" || game.type === selectedType;
    const difficultyMatch = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
    return typeMatch && difficultyMatch;
  });

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedDifficulty("all");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-16 max-w-[58rem]">
        {/* Hero Section */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Video Animation */}
        <div className="flex justify-center w-full mb-4">
          <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
                <video
                  src={gamesTopoVideo.url}
                  className="aspect-video w-full h-auto object-cover"
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  onEnded={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 0;
                  }}
                  onError={(e) => console.error("Games video error:", e)}
                  onStalled={() => console.warn("Games video stalled")}
                />
              </GlassCard>
            </div>
            
            <div className="w-full max-w-4xl mx-auto">
            <SectionHeader title="Jogos & Quizzes" description="Aprenda a Bíblia brincando!" className="mb-0" />
          </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4 animate-fade-in">
          <SectionHeader
            title="Filtros"
            description={loading ? "Carregando..." : `${filteredGames.length} ${filteredGames.length === 1 ? "jogo encontrado" : "jogos encontrados"}`}
            className="mb-0"
          />
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">Tipo de Jogo</h3>
            <div className="flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border">
              {gameTypes.map((type) => {
                const IconComponent = type.icon;
                const isActive = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    aria-pressed={isActive}
                    className={`flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-tight transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="max-w-full truncate">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">Dificuldade</h3>
            <div className="flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border">
              {difficulties.map((diff) => {
                const isActive = selectedDifficulty === diff.value;
                return (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.value)}
                    aria-pressed={isActive}
                    className={`h-11 flex-1 text-xs transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>
          {(selectedType !== "all" || selectedDifficulty !== "all") && (
            <button type="button" onClick={clearFilters} className="mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </>
          ) : filteredGames.length === 0 ? (
            games.length === 0 ? (
              <EmptyState
                icon={<Gamepad2 size={40} strokeWidth={1.5} />}
                title="Nenhum jogo disponível"
                description="Estamos preparando jogos incríveis para você! Volte em breve para descobrir desafios bíblicos divertidos e educativos."
              />
            ) : (
              <EmptyState
                icon={<Search size={40} strokeWidth={1.5} />}
                title="Nenhum jogo encontrado"
                description="Não encontramos jogos que correspondam aos filtros selecionados. Tente ajustar o tipo de jogo ou nível de dificuldade."
                action={{
                  label: "Limpar Filtros",
                  onClick: clearFilters,
                  icon: <X size={16} />
                }}
              />
            )
          ) : (
            filteredGames.map((game) => {
              const IconComponent = (Icons as any)[game.icon_name] || Icons.Gamepad2;
              const img = TYPE_IMAGES[game.type];
              const isOpen = !!expanded[game.id];
              const play = () => navigate(`/games/${game.id}/play`);
              return (
                <div key={game.id} role="button" tabIndex={0} onClick={play}
                  onKeyDown={(e) => { if (e.key === "Enter") play(); }}
                  className="flex cursor-pointer flex-col animate-fade-in">
                  <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
                    <span className="border-beam" aria-hidden />
                    <h3 className="bubble-title relative"><BubbleTitleText text={displayTitle(game.title)} /></h3>
                  </div>
                  <GlassCard className="-mt-4 flex flex-1 flex-col rounded-t-none pt-7">
                    <div className="flex gap-3">
                      {img ? (
                        <img src={img} alt="" loading="lazy" width={64} height={64} className="h-16 w-16 shrink-0 object-contain" />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><IconComponent size={28} /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">{TYPE_LABELS[game.type] ?? game.type}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${DIFF_STYLES[game.difficulty] ?? "bg-muted text-muted-foreground"}`}>{game.difficulty}</span>
                        </div>
                        <p className={`text-sm text-muted-foreground ${isOpen ? "" : "line-clamp-3"}`}>{game.description}</p>
                        {game.description?.length > 120 && (
                          <button type="button" className="mt-1 text-xs font-semibold text-primary"
                            onClick={(e) => { e.stopPropagation(); setExpanded((p) => ({ ...p, [game.id]: !isOpen })); }}>
                            {isOpen ? "Ver menos" : "Ver mais"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      <ArrowNavButton direction="right" label="Jogar" onClick={play} className="w-full" />
                    </div>
                  </GlassCard>
                </div>
              );
            })
          )}
        </div>

        {/* Coming Soon Message */}
        {!loading && filteredGames.length > 0 && (
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-muted-foreground">
              Mais jogos em breve!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
