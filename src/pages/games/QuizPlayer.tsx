import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { GridSkeleton } from "@/components/skeletons/GridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, ListChecks, Trophy } from "lucide-react";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";

const DIFF_STYLES: Record<string, string> = {
  "Fácil": "bg-success/10 text-success",
  "Médio": "bg-warning/10 text-warning",
  "Difícil": "bg-destructive/10 text-destructive",
};
const BUBBLE = "neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground";
import { fireBasicConfetti, fireRainbowConfetti } from "@/lib/confetti";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  verse: string;
}

interface QuizContent {
  questions: QuizQuestion[];
}

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  content_json: QuizContent;
}

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    if (!id) {
      toast.error("ID do jogo não encontrado");
      navigate("/games");
      return;
    }

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('available', true)
      .single();

    if (error || !data) {
      toast.error("Jogo não encontrado");
      navigate("/games");
    } else {
      setGame({
        ...data,
        content_json: data.content_json as unknown as QuizContent
      });
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const isCorrect = answerIndex === game!.content_json.questions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < game!.content_json.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameFinished(true);
      fireRainbowConfetti();
      
      // Registrar conclusão do jogo
      if (user && game) {
        const pointsEarned = calculatePoints(score, game.content_json.questions.length, game.difficulty);
        addActivity(
          'game_completed',
          game.id,
          game.title,
          pointsEarned
        );
      }
    }
  };

  const calculatePoints = (score: number, total: number, difficulty: string): number => {
    const percentage = (score / total) * 100;
    let basePoints = 30;
    
    // Bônus por dificuldade
    if (difficulty === 'medium') basePoints = 50;
    if (difficulty === 'hard') basePoints = 70;
    
    // Bônus por performance
    if (percentage === 100) return basePoints + 30; // Perfeito!
    if (percentage >= 80) return basePoints + 20;
    if (percentage >= 60) return basePoints + 10;
    
    return basePoints;
  };

  const handleReplay = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
    setGameFinished(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <FuturisticNavbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48 bg-muted" />
            <GlassCard>
              <Skeleton className="h-8 w-full mb-6 bg-muted" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-muted" />
                ))}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const questions = game.content_json.questions;
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  if (gameFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background pb-24">
        <FuturisticNavbar />
        
        <main className="container mx-auto px-4 pt-24">
          <div className="max-w-2xl mx-auto">
            <GlassCard className="text-center">
              <div className="mb-6">
                {percentage >= 70 ? (
                  <CheckCircle2 className="w-20 h-20 mx-auto text-primary mb-4" />
                ) : (
                  <XCircle className="w-20 h-20 mx-auto text-red-400 mb-4" />
                )}
                
                <h1 className="text-4xl font-bold mb-2 text-foreground">
                  {percentage >= 70 ? "Parabéns!" : "Continue praticando!"}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  Você acertou {score} de {questions.length} perguntas
                </p>
                
                <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                  {percentage}%
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleReplay}
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="mr-2" />
                  Jogar Novamente
                </Button>
                
                <ArrowNavButton direction="left" label="Voltar aos Jogos" onClick={() => navigate("/games")} />
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-background pb-32">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-20 max-w-[58rem]">
        <div className="space-y-6">
          <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate("/games")} />

          {/* Header */}
          <div>
            <div className={BUBBLE}>
              <span className="border-beam" aria-hidden />
              <h1 className="bubble-title relative"><BubbleTitleText text={game.title.replace(/\bQuizz\b/g, "Quiz")} /></h1>
            </div>
            <GlassCard className="-mt-4 rounded-t-none pt-7 space-y-3">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${DIFF_STYLES[game.difficulty] ?? "bg-muted text-muted-foreground"}`}>{game.difficulty}</span>
              <div className="flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border">
                <div className="flex h-11 flex-1 items-center justify-center gap-2 text-sm text-foreground">
                  <ListChecks size={18} className="text-primary" /> Pergunta {currentQuestion + 1}/{questions.length}
                </div>
                <div className="flex h-11 flex-1 items-center justify-center gap-2 text-sm text-foreground">
                  <Trophy size={18} className="text-primary" /> Pontos {score}/{questions.length}
                </div>
              </div>
              <Progress value={progress} className="h-3 rounded-full bg-primary/15" />
            </GlassCard>
          </div>

          {/* Question Card */}
          <div>
            <div className={BUBBLE}>
              <span className="border-beam" aria-hidden />
              <h2 className="bubble-title relative text-lg"><BubbleTitleText text={currentQ.question} /></h2>
            </div>
            <GlassCard className="-mt-4 rounded-t-none pt-7">
              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === currentQ.correctAnswer;
                  let state = "border-border bg-card hover:border-primary/50 hover:bg-primary/5";
                  let letter = "bg-primary/10 text-primary";
                  if (showFeedback && isCorrectAnswer) { state = "border-success bg-success/10 text-success"; letter = "bg-success text-primary-foreground"; }
                  else if (showFeedback && isSelected) { state = "border-destructive bg-destructive/10 text-destructive"; letter = "bg-destructive text-primary-foreground"; }
                  else if (showFeedback) state = "border-border bg-card opacity-70";
                  else if (isSelected) { state = "border-primary bg-primary/10 text-primary"; letter = "bg-primary text-primary-foreground"; }
                  return (
                    <button key={index} type="button" onClick={() => handleAnswerSelect(index)} disabled={showFeedback}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-medium transition-colors ${state}`}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${letter}`}>{String.fromCharCode(65 + index)}</span>
                      <span className="flex-grow">{option}</span>
                      {showFeedback && isCorrectAnswer && <CheckCircle2 size={20} className="shrink-0" />}
                      {showFeedback && isSelected && !isCorrectAnswer && <XCircle size={20} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className={`mt-5 rounded-2xl p-4 ${isCorrect ? "bg-success/10" : "bg-destructive/10"}`}>
                  <p className={`mb-1 flex items-center gap-2 font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                    {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {isCorrect ? "Correto!" : "Ops!"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">{currentQ.explanation}</p>
                  <p className="text-xs italic text-muted-foreground">{currentQ.verse}</p>
                </div>
              )}

              {showFeedback && (
                <ArrowNavButton direction="right" onClick={handleNextQuestion} className="mt-5 w-full"
                  label={currentQuestion < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"} />
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPlayer;
