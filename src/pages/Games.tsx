import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Brain, Puzzle, Search, Grid3x3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Games = () => {
  const games = [
    {
      id: 1,
      title: "Quiz Bíblico",
      description: "Teste seus conhecimentos sobre histórias e personagens da Bíblia",
      icon: Brain,
      difficulty: "Fácil",
      available: true,
      color: "text-primary",
    },
    {
      id: 2,
      title: "Jogo da Memória",
      description: "Encontre os pares de personagens e histórias bíblicas",
      icon: Grid3x3,
      difficulty: "Médio",
      available: false,
      color: "text-blue-400",
    },
    {
      id: 3,
      title: "Caça-Palavras",
      description: "Descubra palavras-chave escondidas nas histórias bíblicas",
      icon: Search,
      difficulty: "Fácil",
      available: false,
      color: "text-purple-400",
    },
    {
      id: 4,
      title: "Quebra-Cabeça",
      description: "Monte cenas bíblicas e aprenda enquanto se diverte",
      icon: Puzzle,
      difficulty: "Médio",
      available: false,
      color: "text-orange-400",
    },
  ];

  const difficultyColors = {
    Fácil: "bg-primary/20 text-primary border-primary/40",
    Médio: "bg-blue-500/20 text-blue-400 border-blue-400/40",
    Difícil: "bg-red-500/20 text-red-400 border-red-400/40",
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Jogos & Quizzes
          </h1>
          <p className="text-xl text-foreground/80">
            Aprenda a Bíblia brincando! 🎮
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <GlassCard
                key={game.id}
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col h-full">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-background/50 ${game.color}`}>
                      <Icon size={32} />
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
                    variant={game.available ? "default" : "secondary"}
                    disabled={!game.available}
                  >
                    {game.available ? "Jogar Agora" : "Em Breve"}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground">
            Mais jogos em breve! 🚀
          </p>
        </div>
      </main>
    </div>
  );
};

export default Games;
