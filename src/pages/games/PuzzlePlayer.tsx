import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { GridSkeleton } from "@/components/skeletons/GridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { fireCompleteConfetti } from "@/lib/confetti";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

interface PuzzleScene {
  title: string;
  description: string;
  verse: string;
  pieces: number;
}

interface PuzzleGame {
  title: string;
  scenes: PuzzleScene[];
}

export default function PuzzlePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  
  const [game, setGame] = useState<PuzzleGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [tiles, setTiles] = useState<number[]>([]);
  const [correctTiles, setCorrectTiles] = useState<Set<number>>(new Set());
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  useEffect(() => {
    if (game && game.scenes[currentSceneIndex]) {
      initializePuzzle();
    }
  }, [currentSceneIndex, game]);

  const loadGame = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Jogo não encontrado");

      setGame(data.content_json as unknown as PuzzleGame);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
      toast.error("Erro ao carregar o jogo");
    } finally {
      setLoading(false);
    }
  };

  const initializePuzzle = () => {
    if (!game) return;
    
    const pieceCount = game.scenes[currentSceneIndex].pieces;
    const initialTiles = Array.from({ length: pieceCount }, (_, i) => i);
    setTiles(shuffleArray([...initialTiles]));
    setCorrectTiles(new Set());
    setCompleted(false);
  };

  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleDragStart = (tile: number, index: number) => {
    setDraggedTile(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedTile === null) return;

    const newTiles = [...tiles];
    [newTiles[draggedTile], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[draggedTile]];
    setTiles(newTiles);
    setDraggedTile(null);

    checkCompletion(newTiles);
  };

  const handleTouchStart = (index: number) => {
    setDraggedTile(index);
  };

  const handleTouchEnd = (targetIndex: number) => {
    if (draggedTile === null) return;
    handleDrop(targetIndex);
  };

  const checkCompletion = (currentTiles: number[]) => {
    const newCorrectTiles = new Set<number>();
    let allCorrect = true;

    currentTiles.forEach((tile, index) => {
      if (tile === index) {
        newCorrectTiles.add(index);
      } else {
        allCorrect = false;
      }
    });

    setCorrectTiles(newCorrectTiles);

    if (allCorrect && currentTiles.length > 0) {
      setCompleted(true);
      toast.success("🎉 Parabéns! Você completou o quebra-cabeça!");
      fireCompleteConfetti();
      
      // Registrar se é a última cena
      if (game && user) {
        const isLastScene = currentSceneIndex === game.scenes.length - 1;
        
        if (isLastScene) {
          const pointsEarned = 60;
          addActivity(
            'game_completed',
            id || '',
            game.title,
            pointsEarned
          );
        }
      }
    }
  };

  const handleNextScene = () => {
    if (game && currentSceneIndex < game.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <GlassCard className="space-y-4">
              <Skeleton className="h-8 w-64 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
            </GlassCard>
            <GlassCard>
              <GridSkeleton rows={4} cols={4} className="max-w-md mx-auto" />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard className="max-w-md mx-auto text-center">
            <p className="text-destructive mb-4">Jogo não encontrado</p>
            <Button onClick={() => navigate("/games")}>Voltar aos Jogos</Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const currentScene = game.scenes[currentSceneIndex];
  const gridSize = Math.sqrt(currentScene.pieces);
  const progress = (correctTiles.size / currentScene.pieces) * 100;
  const tileSize = isMobile ? "w-16 h-16" : "w-20 h-20";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">{game.title}</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={initializePuzzle}
                  disabled={completed}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Embaralhar
                </Button>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{currentScene.title}</h2>
                <p className="text-muted-foreground">{currentScene.description}</p>
                <p className="text-sm italic text-primary/80">"{currentScene.verse}"</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </GlassCard>

          {/* Puzzle Grid */}
          <GlassCard>
            <div 
              className="grid gap-2 mx-auto w-fit"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {tiles.map((tile, index) => (
                <div
                  key={index}
                  draggable={!completed}
                  onDragStart={() => handleDragStart(tile, index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={() => handleTouchEnd(index)}
                  className={`
                    ${tileSize}
                    flex items-center justify-center
                    rounded-lg border-2 transition-all cursor-move
                    ${correctTiles.has(index) 
                      ? 'bg-primary/20 border-primary' 
                      : 'bg-secondary border-secondary-foreground/20 hover:border-primary/50'
                    }
                    ${draggedTile === index ? 'opacity-50' : ''}
                    ${completed ? 'cursor-default' : ''}
                  `}
                >
                  <span className="text-2xl font-bold">{tile + 1}</span>
                </div>
              ))}
            </div>

            {completed && (
              <div className="mt-6 text-center">
                <p className="text-xl font-bold text-primary mb-4">
                  🎉 Quebra-cabeça concluído!
                </p>
              </div>
            )}
          </GlassCard>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevScene}
              disabled={currentSceneIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <span className="text-sm text-muted-foreground">
              Cena {currentSceneIndex + 1} de {game.scenes.length}
            </span>

            <Button
              variant="outline"
              onClick={handleNextScene}
              disabled={currentSceneIndex === game.scenes.length - 1}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => navigate("/games")}>
              Voltar aos Jogos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
