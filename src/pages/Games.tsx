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
    <div className="min-h-screen bg-black pb-24">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-16">
        {/* Hero Section */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="flex flex-col items-center w-full max-w-3xl">
        {/* Video Animation */}
        <div className="flex justify-center w-full mb-4">
          <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
                <video
                  src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_be332ed2_1763196148899.mp4"
                  className="w-full h-auto"
                  style={{ maxHeight: '300px' }}
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
            
            <GlassCard className="w-full text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Jogos & Quizzes
              </h1>
              <p className="text-lg md:text-xl text-foreground/80">
                Aprenda a Bíblia brincando! 🎮
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Filters Section */}
        <GlassCard className="max-w-6xl mx-auto mb-8 animate-fade-in">
          <div className="space-y-6">
            {/* Game Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Tipo de Jogo</h3>
              <div className="flex flex-wrap gap-2">
                {gameTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isActive = selectedType === type.value;
                  return (
                  <Button
                      key={type.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.value)}
                      className={`transition-all duration-300 active:scale-95 group ${
                        isActive ? "neon-glow shadow-lg shadow-primary/50" : "hover:border-primary/50"
                      }`}
                    >
                      <IconComponent size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Dificuldade</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => {
                  const isActive = selectedDifficulty === diff.value;
                  return (
                    <Button
                      key={diff.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className={`transition-all duration-300 active:scale-95 ${
                        isActive ? "neon-glow shadow-lg shadow-primary/50" : "hover:border-primary/50"
                      } ${diff.color}`}
                    >
                      {diff.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters & Results Counter */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  "Carregando..."
                ) : (
                  `${filteredGames.length} ${filteredGames.length === 1 ? "jogo encontrado" : "jogos encontrados"}`
                )}
              </p>
              {(selectedType !== "all" || selectedDifficulty !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
                description="Estamos preparando jogos incríveis para você! Volte em breve para descobrir desafios bíblicos divertidos e educativos. 🎮✨"
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
              return (
                <GlassCard
                  key={game.id}
                  hoverable
                  pressable
                  className="group"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-background/50 ${game.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                        <IconComponent size={32} />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${difficultyColors[game.difficulty as keyof typeof difficultyColors]} border transition-all duration-300 group-hover:scale-105`}
                      >
                        {game.difficulty}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {game.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {game.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/games/${game.id}/play`);
                      }}
                    >
                      Jogar Agora
                    </Button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        {/* Coming Soon Message */}
        {!loading && filteredGames.length > 0 && (
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-muted-foreground">
              Mais jogos em breve! 🚀
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
