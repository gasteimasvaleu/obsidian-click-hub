import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-black pb-24">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Video Animation */}
          <div className="flex justify-center mb-4">
            <video
              className="w-[500px] h-[500px] max-w-full"
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                const video = e.currentTarget;
                video.currentTime = 0;
                video.pause();
              }}
            >
              <source 
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/jesusgame.mp4" 
                type="video/mp4" 
              />
            </video>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Jogos & Quizzes
          </h1>
          <p className="text-xl text-foreground/80">
            Aprenda a Bíblia brincando! 🎮
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">Carregando jogos...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">
                Nenhum jogo disponível no momento. Volte em breve! 🎮
              </p>
            </div>
          ) : (
            games.map((game) => {
              const IconComponent = (Icons as any)[game.icon_name] || Icons.Gamepad2;
              return (
                <GlassCard
                  key={game.id}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-background/50 ${game.color}`}>
                        <IconComponent size={32} />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${difficultyColors[game.difficulty as keyof typeof difficultyColors]} border`}
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
                      className="w-full"
                      onClick={() => navigate(`/games/${game.id}/play`)}
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
        {!loading && games.length > 0 && (
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
