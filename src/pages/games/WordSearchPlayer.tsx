import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { GridSkeleton } from "@/components/skeletons/GridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { fireMiniConfetti, fireCompleteConfetti } from "@/lib/confetti";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

interface GameData {
  words: string[];
  hints: { [key: string]: string };
}

interface WordSearchGame {
  grid: string[][];
  words: Array<{
    word: string;
    hint: string;
    start: { row: number; col: number };
    end: { row: number; col: number };
  }>;
}

interface CellSelection {
  row: number;
  col: number;
}

// Função para gerar o grid do caça-palavras
function generateWordSearchGrid(words: string[], gridSize: number = 15, isMobile: boolean = false): WordSearchGame {
  const actualGridSize = isMobile ? 12 : gridSize;
  const grid: string[][] = Array(actualGridSize).fill(null).map(() => Array(actualGridSize).fill(''));
  const placedWords: WordSearchGame['words'] = [];
  
  const directions = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diagonal \
    { dr: 1, dc: -1 },  // diagonal /
  ];

  const canPlaceWord = (word: string, row: number, col: number, dir: { dr: number; dc: number }): boolean => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dir.dr;
      const newCol = col + i * dir.dc;
      
      if (newRow < 0 || newRow >= actualGridSize || newCol < 0 || newCol >= actualGridSize) {
        return false;
      }
      
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (word: string, row: number, col: number, dir: { dr: number; dc: number }): void => {
    const start = { row, col };
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dir.dr;
      const newCol = col + i * dir.dc;
      grid[newRow][newCol] = word[i];
    }
    const end = { 
      row: row + (word.length - 1) * dir.dr, 
      col: col + (word.length - 1) * dir.dc 
    };
    placedWords.push({ word, hint: '', start, end });
  };

  // Tentar colocar cada palavra
  words.forEach(word => {
    const upperWord = word.toUpperCase();
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * actualGridSize);
      const col = Math.floor(Math.random() * actualGridSize);
      
      if (canPlaceWord(upperWord, row, col, direction)) {
        placeWord(upperWord, row, col, direction);
        placed = true;
      }
      attempts++;
    }
  });

  // Preencher espaços vazios com letras aleatórias
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < actualGridSize; i++) {
    for (let j = 0; j < actualGridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, words: placedWords };
}

export default function WordSearchPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [game, setGame] = useState<WordSearchGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<CellSelection[]>([]);
  const [gameTitle, setGameTitle] = useState<string>('');
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
      setGameTitle(data.title);
      
      const gameData = data.content_json as unknown as GameData;
      const generatedGame = generateWordSearchGrid(gameData.words, 15, isMobile);
      
      // Adicionar dicas às palavras
      generatedGame.words.forEach(wordObj => {
        wordObj.hint = gameData.hints[wordObj.word] || '';
      });
      
      setGame(generatedGame);
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

  // Suporte para touch (mobile)
  const handleTouchStart = (row: number, col: number) => {
    setSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!selecting) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.hasAttribute('data-row') && element.hasAttribute('data-col')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      
      const lastCell = selectedCells[selectedCells.length - 1];
      if (!lastCell || lastCell.row !== row || lastCell.col !== col) {
        setSelectedCells([...selectedCells, { row, col }]);
      }
    }
  };

  const handleTouchEnd = () => {
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
      const newFoundWords = new Set([...foundWords, foundWord.word]);
      setFoundWords(newFoundWords);
      toast.success(`Palavra encontrada: ${foundWord.word}!`);
      fireMiniConfetti();
      
      // Verificar se todas as palavras foram encontradas
      if (newFoundWords.size === game.words.length) {
        setTimeout(() => {
          toast.success("Parabéns! Você encontrou todas as palavras!");
          fireCompleteConfetti();
          
          if (user) {
            const pointsEarned = 50;
            addActivity(
              'game_completed',
              id || '',
              gameTitle || 'Caça-Palavras',
              pointsEarned
            );
          }
        }, 500);
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
          <GlassCard className="max-w-4xl mx-auto p-6">
            <Skeleton className="h-8 w-64 mb-6 bg-white/10 mx-auto" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 bg-white/10" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/10" />
                ))}
              </div>
              <div className="md:col-span-2">
                <GridSkeleton rows={isMobile ? 12 : 15} cols={isMobile ? 12 : 15} />
              </div>
            </div>
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
      <div className="container mx-auto px-2 md:px-4 pt-24 pb-32">
        <GlassCard className="max-w-4xl mx-auto p-3 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6 text-center">{title}</h1>
          
          <div className="flex flex-col gap-4 md:gap-6 md:grid md:grid-cols-3">
            {/* Lista de palavras - Primeiro em mobile */}
            <div className="md:col-span-1 order-2 md:order-1">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-foreground">Palavras para encontrar:</h2>
              <div className={`space-y-2 ${isMobile ? 'max-h-[200px]' : 'max-h-[500px]'} overflow-y-auto`}>
                {game.words.map((wordObj, index) => (
                  <div
                    key={index}
                    className={`p-2 md:p-3 rounded transition-colors ${
                      foundWords.has(wordObj.word)
                        ? "bg-primary/20 text-primary line-through"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="font-semibold text-sm md:text-base">{wordObj.word}</div>
                    {wordObj.hint && (
                      <div className="text-xs md:text-sm text-muted-foreground mt-1">{wordObj.hint}</div>
                    )}
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
            <div className="md:col-span-2 order-1 md:order-2 flex justify-center">
              <div
                className="inline-block"
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setSelecting(false);
                  setSelectedCells([]);
                }}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className={`grid ${isMobile ? 'gap-0.5' : 'gap-1'} select-none`}>
                  {game.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className={`flex ${isMobile ? 'gap-0.5' : 'gap-1'}`}>
                      {row.map((letter, colIndex) => (
                        <div
                          key={colIndex}
                          data-row={rowIndex}
                          data-col={colIndex}
                          className={`
                            ${isMobile ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-lg'}
                            flex items-center justify-center
                            font-bold rounded cursor-pointer
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
                          onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
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

          <div className="mt-4 md:mt-6 flex justify-center gap-2 md:gap-4">
            <Button onClick={() => navigate("/games")} variant="outline" size={isMobile ? "sm" : "default"}>
              Voltar aos Jogos
            </Button>
            <Button onClick={loadGame} size={isMobile ? "sm" : "default"}>Reiniciar</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
