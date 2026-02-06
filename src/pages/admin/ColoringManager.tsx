import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { MediaUploader } from '@/components/plataforma/MediaUploader';

interface Drawing {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  difficulty: string;
  display_order: number;
  available: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'personagens',
  difficulty: 'facil',
  display_order: 0,
  image_url: '',
};

const CATEGORY_LABELS: Record<string, string> = {
  contos: 'Contos',
  parabolas: 'Parábolas',
  personagens: 'Personagens',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

const ColoringManager = () => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState<Drawing | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coloring_drawings')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar desenhos');
      console.error(error);
    } else {
      setDrawings(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setIsCreateOpen(true);
  };

  const openEdit = (drawing: Drawing) => {
    setEditingDrawing(drawing);
    setFormData({
      title: drawing.title,
      description: drawing.description || '',
      category: drawing.category,
      difficulty: drawing.difficulty,
      display_order: drawing.display_order,
      image_url: drawing.image_url,
    });
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.image_url) {
      toast.error('Título e imagem são obrigatórios');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('coloring_drawings').insert([{
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      difficulty: formData.difficulty,
      display_order: formData.display_order,
      image_url: formData.image_url,
    }]);

    if (error) {
      toast.error('Erro ao criar desenho');
      console.error(error);
    } else {
      toast.success('Desenho criado com sucesso!');
      setIsCreateOpen(false);
      loadDrawings();
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingDrawing || !formData.title || !formData.image_url) {
      toast.error('Título e imagem são obrigatórios');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('coloring_drawings').update({
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      difficulty: formData.difficulty,
      display_order: formData.display_order,
      image_url: formData.image_url,
    }).eq('id', editingDrawing.id);

    if (error) {
      toast.error('Erro ao atualizar desenho');
      console.error(error);
    } else {
      toast.success('Desenho atualizado com sucesso!');
      setIsEditOpen(false);
      loadDrawings();
    }
    setSaving(false);
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('coloring_drawings')
      .update({ available: !current })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar visibilidade');
    } else {
      toast.success(current ? 'Desenho ocultado' : 'Desenho visível');
      loadDrawings();
    }
  };

  const deleteDrawing = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este desenho?')) return;
    const { error } = await supabase.from('coloring_drawings').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir desenho');
    } else {
      toast.success('Desenho excluído com sucesso');
      loadDrawings();
    }
  };

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nome do desenho"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição opcional"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="contos">Contos</SelectItem>
              <SelectItem value="parabolas">Parábolas</SelectItem>
              <SelectItem value="personagens">Personagens</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Dificuldade</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="facil">Fácil</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="dificil">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="display_order">Ordem de exibição</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
        />
      </div>
      <MediaUploader
        label="Imagem do desenho *"
        accept="image"
        folder="colorir"
        bucket="criativos"
        currentUrl={formData.image_url || undefined}
        onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
        onRemove={() => setFormData({ ...formData, image_url: '' })}
      />
    </div>
  );

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Desenhos</h2>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Novo Desenho
            </Button>
          </div>

          <Card className="glass border-primary/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead className="w-20">Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : drawings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhum desenho cadastrado. Clique em "Novo Desenho" para criar.
                    </TableCell>
                  </TableRow>
                ) : (
                  drawings.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <img
                          src={d.image_url}
                          alt={d.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell>{CATEGORY_LABELS[d.category] || d.category}</TableCell>
                      <TableCell>{DIFFICULTY_LABELS[d.difficulty] || d.difficulty}</TableCell>
                      <TableCell className="text-center">{d.display_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          d.available
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {d.available ? 'Disponível' : 'Oculto'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleAvailability(d.id, d.available)}>
                            {d.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteDrawing(d.id)}>
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

          {/* Create Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Desenho</DialogTitle>
                <DialogDescription>Adicione um novo desenho à galeria de colorir.</DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={saving}>
                  {saving ? 'Salvando...' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Desenho</DialogTitle>
                <DialogDescription>Atualize os dados do desenho.</DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                <Button onClick={handleUpdate} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ColoringManager;
