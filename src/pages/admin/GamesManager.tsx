import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  available: boolean;
  icon_name: string;
  color: string;
  created_at: string;
}

const GamesManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    icon_name: '',
    color: '',
    available: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar jogos');
      console.error(error);
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('games')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar jogo');
    } else {
      toast.success('Jogo atualizado com sucesso');
      loadGames();
    }
  };

  const deleteGame = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return;

    const { error } = await supabase.from('games').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir jogo');
    } else {
      toast.success('Jogo excluído com sucesso');
      loadGames();
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      quiz: 'Quiz',
      memory: 'Memória',
      wordsearch: 'Caça-Palavras',
      puzzle: 'Quebra-Cabeça',
    };
    return labels[type] || type;
  };

  const openEditDialog = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      difficulty: game.difficulty,
      icon_name: game.icon_name,
      color: game.color,
      available: game.available,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGame = async () => {
    if (!editingGame) return;

    const { error } = await supabase
      .from('games')
      .update({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        icon_name: formData.icon_name,
        color: formData.color,
        available: formData.available,
      })
      .eq('id', editingGame.id);

    if (error) {
      toast.error('Erro ao atualizar jogo');
    } else {
      toast.success('Jogo atualizado com sucesso!');
      setIsEditDialogOpen(false);
      loadGames();
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Jogos</h2>
            <Button
              className="gap-2"
              onClick={() => navigate('/admin/games/generate')}
            >
              <Sparkles className="h-4 w-4" />
              Gerar Jogo com IA
            </Button>
          </div>

          <Card className="glass border-primary/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum jogo cadastrado. Clique em "Gerar Jogo com IA" para criar o primeiro!
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>{getTypeLabel(game.type)}</TableCell>
                      <TableCell>{game.difficulty}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            game.available
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {game.available ? 'Disponível' : 'Oculto'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAvailability(game.id, game.available)}
                          >
                            {game.available ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(game)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGame(game.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Editar Jogo</DialogTitle>
                <DialogDescription>
                  Atualize os detalhes do jogo. O tipo e conteúdo não podem ser alterados.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Badge variant="secondary" className="w-fit">
                    {editingGame && getTypeLabel(editingGame.type)}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon_name">Ícone (Lucide)</Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="Brain"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Cor (hex)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#9b87f5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Disponível</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateGame}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default GamesManager;
