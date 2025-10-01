import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WordSearchGame {
  grid: string[][];
  words: Array<{
    word: string;
    start: { row: number; col: number };
    end: { row: number; col: number };
  }>;
}

interface CellSelection {
  row: number;
  col: number;
}

export default function WordSearchPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<WordSearchGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<CellSelection[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select("title, content_json")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Jogo não encontrado");

      setTitle(data.title);
      setGame(data.content_json as unknown as WordSearchGame);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
      toast.error("Erro ao carregar o jogo");
      navigate("/games");
    } finally {
      setLoading(false);
    }
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!selecting) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    // Verifica se está na mesma linha, coluna ou diagonal
    const rowDiff = Math.abs(row - lastCell.row);
    const colDiff = Math.abs(col - lastCell.col);
    
    if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    if (selectedCells.length < 2) {
      setSelecting(false);
      setSelectedCells([]);
      return;
    }

    checkSelectedWord();
    setSelecting(false);
    setSelectedCells([]);
  };

  const checkSelectedWord = () => {
    if (!game) return;

    const selectedWord = selectedCells
      .map(cell => game.grid[cell.row][cell.col])
      .join("");

    const foundWord = game.words.find(w => 
      w.word.toLowerCase() === selectedWord.toLowerCase() ||
      w.word.toLowerCase() === selectedWord.split("").reverse().join("").toLowerCase()
    );

    if (foundWord && !foundWords.has(foundWord.word)) {
      setFoundWords(new Set([...foundWords, foundWord.word]));
      toast.success(`Palavra encontrada: ${foundWord.word}!`);
      
      if (foundWords.size + 1 === game.words.length) {
        toast.success("Parabéns! Você encontrou todas as palavras!");
      }
    }
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    if (!game) return false;
    
    return game.words.some(word => {
      if (!foundWords.has(word.word)) return false;
      
      const rowStart = Math.min(word.start.row, word.end.row);
      const rowEnd = Math.max(word.start.row, word.end.row);
      const colStart = Math.min(word.start.col, word.end.col);
      const colEnd = Math.max(word.start.col, word.end.col);
      
      return row >= rowStart && row <= rowEnd && col >= colStart && col <= colEnd;
    });
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

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <FuturisticNavbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <GlassCard className="max-w-md mx-auto text-center">
            <p className="text-destructive mb-4">Erro ao carregar o jogo</p>
            <Button onClick={() => navigate("/games")}>Voltar aos Jogos</Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <GlassCard className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">{title}</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lista de palavras */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Palavras para encontrar:</h2>
              <div className="space-y-2">
                {game.words.map((wordObj, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded transition-colors ${
                      foundWords.has(wordObj.word)
                        ? "bg-primary/20 text-primary line-through"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {wordObj.word}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Encontradas: {foundWords.size} / {game.words.length}
                </p>
              </div>
            </div>

            {/* Grid do caça-palavras */}
            <div className="md:col-span-2">
              <div
                className="inline-block mx-auto"
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setSelecting(false);
                  setSelectedCells([]);
                }}
              >
                <div className="grid gap-1 select-none">
                  {game.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                      {row.map((letter, colIndex) => (
                        <div
                          key={colIndex}
                          className={`
                            w-10 h-10 flex items-center justify-center
                            font-bold text-lg rounded cursor-pointer
                            transition-colors duration-200
                            ${isCellInFoundWord(rowIndex, colIndex)
                              ? "bg-primary text-primary-foreground"
                              : isCellSelected(rowIndex, colIndex)
                              ? "bg-accent text-accent-foreground"
                              : "bg-card text-card-foreground hover:bg-accent/50"
                            }
                          `}
                          onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate("/games")} variant="outline">
              Voltar aos Jogos
            </Button>
            <Button onClick={loadGame}>Reiniciar</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
