import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import QuizPlayer from "./QuizPlayer";
import MemoryPlayer from "./MemoryPlayer";
import WordSearchPlayer from "./WordSearchPlayer";
import PuzzlePlayer from "./PuzzlePlayer";

export default function GamePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadGameType();
  }, [id]);

  const loadGameType = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select("type")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Jogo não encontrado");

      setGameType(data.type);
    } catch (error) {
      console.error("Erro ao carregar tipo do jogo:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse text-primary text-xl">Carregando jogo...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard className="max-w-md mx-auto text-center">
            <p className="text-destructive mb-4">Erro ao carregar o jogo</p>
            <Button onClick={() => navigate("/games")}>
              Voltar aos Jogos
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Renderizar o componente específico baseado no tipo do jogo
  switch (gameType) {
    case "quiz":
      return <QuizPlayer />;
    case "memory":
      return <MemoryPlayer />;
    case "wordsearch":
      return <WordSearchPlayer />;
    case "puzzle":
      return <PuzzlePlayer />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
          <FuturisticNavbar />
          <div className="container mx-auto px-4 pt-24 pb-12">
            <GlassCard className="max-w-md mx-auto text-center">
              <p className="text-destructive mb-4">Tipo de jogo desconhecido</p>
              <Button onClick={() => navigate("/games")}>
                Voltar aos Jogos
              </Button>
            </GlassCard>
          </div>
        </div>
      );
  }
}
