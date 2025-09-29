import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
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
    
    const isCorrect = answerIndex === game!.content_json.questions[currentQuestion].correct;
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
    }
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-foreground/80">Carregando jogo...</p>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const questions = game.content_json.questions;
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQ.correct;

  if (gameFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-black pb-24">
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
                  {percentage >= 70 ? "Parabéns! 🎉" : "Continue praticando! 💪"}
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
                
                <Button 
                  onClick={() => navigate("/games")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="mr-2" />
                  Voltar aos Jogos
                </Button>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <FuturisticNavbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/games")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2" />
              Voltar
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground">{game.title}</h1>
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                {game.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
              <span>Pontuação: {score}/{questions.length}</span>
            </div>
            
            <Progress value={progress} className="mt-3" />
          </div>

          {/* Question Card */}
          <GlassCard>
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {currentQ.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQ.correct;
                
                let buttonClass = "";
                if (showFeedback) {
                  if (isCorrectAnswer) {
                    buttonClass = "bg-primary/20 border-primary text-primary";
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonClass = "bg-red-500/20 border-red-500 text-red-400";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showFeedback 
                        ? buttonClass
                        : "border-muted hover:border-primary hover:bg-primary/10"
                    } ${isSelected && !showFeedback ? "border-primary bg-primary/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-grow">{option}</span>
                      {showFeedback && isCorrectAnswer && (
                        <CheckCircle2 className="flex-shrink-0 text-primary" />
                      )}
                      {showFeedback && isSelected && !isCorrectAnswer && (
                        <XCircle className="flex-shrink-0 text-red-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? "bg-primary/10 border border-primary/30" : "bg-red-500/10 border border-red-500/30"
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="flex-shrink-0 text-primary mt-1" />
                  ) : (
                    <XCircle className="flex-shrink-0 text-red-400 mt-1" />
                  )}
                  <div>
                    <p className="font-bold mb-2 text-foreground">
                      {isCorrect ? "Correto! 🎉" : "Ops! 😅"}
                    </p>
                    <p className="text-muted-foreground mb-3">{currentQ.explanation}</p>
                    <p className="text-sm italic text-muted-foreground">📖 {currentQ.verse}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {showFeedback && (
              <Button 
                onClick={handleNextQuestion}
                className="w-full"
                size="lg"
              >
                {currentQuestion < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
              </Button>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default QuizPlayer;
