import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const GameGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: '',
    theme: '',
  });
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!gameData.title || !gameData.type || !gameData.difficulty || !gameData.theme) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-game-content', {
        body: {
          type: gameData.type,
          title: gameData.title,
          theme: gameData.theme,
          difficulty: gameData.difficulty,
        },
      });

      if (error) throw error;

      const iconMap: Record<string, string> = {
        quiz: 'Brain',
        memory: 'Grid3x3',
        wordsearch: 'Search',
        puzzle: 'Puzzle',
      };

      const colorMap: Record<string, string> = {
        quiz: 'text-primary',
        memory: 'text-blue-400',
        wordsearch: 'text-purple-400',
        puzzle: 'text-orange-400',
      };

      const { error: insertError } = await supabase.from('games').insert([{
        title: gameData.title,
        description: gameData.description,
        type: gameData.type as any,
        difficulty: gameData.difficulty,
        content_json: data.content as any,
        available: false,
        icon_name: iconMap[gameData.type] || 'Gamepad2',
        color: colorMap[gameData.type] || 'text-primary',
      }]);

      if (insertError) throw insertError;

      toast.success('Jogo gerado com sucesso! Revise e publique quando estiver pronto.');
      navigate('/admin/games');
    } catch (error: any) {
      console.error('Error generating game:', error);
      toast.error(error.message || 'Erro ao gerar jogo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate('/admin/games')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Card className="glass border-primary/20 max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Gerar Jogo com IA
              </CardTitle>
              <CardDescription>
                Use a IA para criar conteúdo bíblico interativo automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Jogo</Label>
                <Input
                  id="title"
                  placeholder="Ex: Quiz sobre o Novo Testamento"
                  value={gameData.title}
                  onChange={(e) => setGameData({ ...gameData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva brevemente o que os usuários vão aprender..."
                  value={gameData.description}
                  onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Jogo</Label>
                <Select value={gameData.type} onValueChange={(value) => setGameData({ ...gameData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz Bíblico</SelectItem>
                    <SelectItem value="memory">Jogo da Memória</SelectItem>
                    <SelectItem value="wordsearch">Caça-Palavras</SelectItem>
                    <SelectItem value="puzzle">Quebra-Cabeça</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={gameData.difficulty} onValueChange={(value) => setGameData({ ...gameData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Tema Bíblico (Contexto)</Label>
                <Input
                  id="theme"
                  placeholder="Ex: Êxodo, Novo Testamento, Milagres..."
                  value={gameData.theme}
                  onChange={(e) => setGameData({ ...gameData, theme: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  💡 O título é o foco principal. O tema ajuda a contextualizar (ex: livro bíblico ou categoria)
                </p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Gerando...' : 'Gerar Jogo com IA'}
              </Button>

              <div className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-lg">
                <p className="font-medium mb-2">💡 Usando Gemini 2.5 Flash (Grátis até 06/10/2025)</p>
                <p>
                  A IA irá gerar conteúdo bíblico apropriado baseado no tema escolhido.
                  Após a geração, você poderá revisar e editar antes de publicar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default GameGenerator;
