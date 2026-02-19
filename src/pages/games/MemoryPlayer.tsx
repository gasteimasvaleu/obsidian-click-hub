import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { GridSkeleton } from "@/components/skeletons/GridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { fireCompleteConfetti } from "@/lib/confetti";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

interface MemoryPair {
  card1: string;
  card2: string;
  category: string;
}

interface MemoryContent {
  pairs: MemoryPair[];
}

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  content_json: MemoryContent;
}

interface Card {
  id: number;
  content: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    loadGame();
  }, [id]);

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

      setGame(data as unknown as Game);
      initializeCards(data as unknown as Game);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCards = (gameData: Game) => {
    const pairs = gameData.content_json.pairs;
    const cardsList: Card[] = [];
    
    pairs.forEach((pair, index) => {
      cardsList.push({
        id: index * 2,
        content: pair.card1,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
      cardsList.push({
        id: index * 2 + 1,
        content: pair.card2,
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Embaralhar as cartas
    const shuffled = cardsList.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardClick = (cardId: number) => {
    if (!canFlip) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find(c => c.id === cardId)?.isMatched) return;
    if (flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedIds: number[]) => {
    setCanFlip(false);
    const [id1, id2] = flippedIds;
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    if (card1 && card2 && card1.pairId === card2.pairId) {
      // Match!
      setTimeout(() => {
        setCards(prev =>
          prev.map(card =>
            card.id === id1 || card.id === id2
              ? { ...card, isMatched: true }
              : card
          )
        );
        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);
        setFlippedCards([]);
        setCanFlip(true);

        // Verificar se jogo completou
        if (game && newMatchedPairs === game.content_json.pairs.length) {
          setGameFinished(true);
          fireCompleteConfetti();
          
          if (user) {
            const pointsEarned = calculateMemoryPoints(moves + 1, game.content_json.pairs.length);
            addActivity(
              'game_completed',
              game.id,
              game.title,
              pointsEarned
            );
          }
        }
      }, 600);
    } else {
      // No match
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
        }, 3000);
    }
  };

  const handleReplay = () => {
    if (game) {
      initializeCards(game);
      setFlippedCards([]);
      setMoves(0);
      setMatchedPairs(0);
      setGameFinished(false);
      setCanFlip(true);
    }
  };

  const calculateMemoryPoints = (moves: number, totalPairs: number): number => {
    const perfectMoves = totalPairs;
    let points = 40;
    
    // Bônus por eficiência
    if (moves <= perfectMoves) return points + 40; // Perfeito!
    if (moves <= perfectMoves * 1.5) return points + 20;
    if (moves <= perfectMoves * 2) return points + 10;
    
    return points;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-64 bg-white/10" />
            <GridSkeleton rows={4} cols={6} className="max-w-2xl mx-auto" />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard>
            <p className="text-destructive text-center">Jogo não encontrado</p>
            <Button onClick={() => navigate("/games")} className="mt-4">
              Voltar aos Jogos
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const rating = moves <= game.content_json.pairs.length * 1.5 ? "Excelente!" : 
                   moves <= game.content_json.pairs.length * 2 ? "Muito Bom!" : "Bom!";

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">🎉 Parabéns!</h2>
            <p className="text-xl mb-6">Você completou o jogo da memória!</p>
            
            <div className="space-y-4 mb-8">
              <div className="glass rounded-lg p-4">
                <p className="text-lg">
                  <span className="text-muted-foreground">Tentativas:</span>{" "}
                  <span className="font-bold text-primary">{moves}</span>
                </p>
              </div>
              <div className="glass rounded-lg p-4">
                <p className="text-lg">
                  <span className="text-muted-foreground">Pares encontrados:</span>{" "}
                  <span className="font-bold text-primary">{matchedPairs}/{game.content_json.pairs.length}</span>
                </p>
              </div>
              <div className="glass rounded-lg p-4">
                <p className="text-2xl font-bold text-primary">{rating}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleReplay} className="gap-2">
                <RotateCcw size={20} />
                Jogar Novamente
              </Button>
              <Button onClick={() => navigate("/games")} variant="outline" className="gap-2">
                <ArrowLeft size={20} />
                Voltar aos Jogos
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-24 pb-32">
        <GlassCard className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{game.title}</h1>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Tentativas: {moves}</span>
              <span>Pares: {matchedPairs}/{game.content_json.pairs.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {cards.map((card) => {
              const isFlipped = flippedCards.includes(card.id) || card.isMatched;
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!canFlip || isFlipped}
                  className={`
                    aspect-square rounded-lg p-2 text-sm font-medium
                    transition-all duration-300 transform
                    ${isFlipped ? 'bg-primary text-primary-foreground scale-105' : 'glass hover:scale-105'}
                    ${card.isMatched ? 'opacity-60' : ''}
                    disabled:cursor-not-allowed
                  `}
                >
                  {isFlipped ? (
                    <span className="flex items-center justify-center h-full text-xs md:text-sm break-words">
                      {card.content}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center h-full text-2xl">
                      ?
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate("/games")} variant="outline" className="gap-2">
              <ArrowLeft size={20} />
              Voltar aos Jogos
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
