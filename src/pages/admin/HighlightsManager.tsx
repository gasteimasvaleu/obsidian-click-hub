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
import { Label } from '@/components/ui/label';
import { MediaUploader } from '@/components/plataforma/MediaUploader';

interface Highlight {
  id: string;
  title: string;
  image_url: string;
  link_to: string | null;
  display_order: number;
  available: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  title: '',
  image_url: '',
  link_to: '',
  display_order: 0,
};

const HighlightsManager = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Highlight | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadHighlights(); }, []);

  const loadHighlights = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('home_highlights' as any)
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar lançamentos');
      console.error(error);
    } else {
      setHighlights((data as any[]) || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setIsCreateOpen(true);
  };

  const openEdit = (item: Highlight) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image_url: item.image_url,
      link_to: item.link_to || '',
      display_order: item.display_order,
    });
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.image_url) {
      toast.error('Imagem é obrigatória');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('home_highlights' as any).insert([{
      title: formData.title,
      image_url: formData.image_url,
      link_to: formData.link_to || null,
      display_order: formData.display_order,
    }] as any);

    if (error) {
      toast.error('Erro ao criar lançamento');
      console.error(error);
    } else {
      toast.success('Lançamento criado com sucesso!');
      setIsCreateOpen(false);
      loadHighlights();
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData.image_url) {
      toast.error('Imagem é obrigatória');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('home_highlights' as any).update({
      title: formData.title,
      image_url: formData.image_url,
      link_to: formData.link_to || null,
      display_order: formData.display_order,
    } as any).eq('id', editingItem.id);

    if (error) {
      toast.error('Erro ao atualizar lançamento');
      console.error(error);
    } else {
      toast.success('Lançamento atualizado!');
      setIsEditOpen(false);
      loadHighlights();
    }
    setSaving(false);
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('home_highlights' as any)
      .update({ available: !current } as any)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar visibilidade');
    } else {
      toast.success(current ? 'Lançamento ocultado' : 'Lançamento visível');
      loadHighlights();
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;
    const { error } = await supabase.from('home_highlights' as any).delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir lançamento');
    } else {
      toast.success('Lançamento excluído');
      loadHighlights();
    }
  };

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título (referência)</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Novo curso de histórias"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="link_to">Link (rota opcional)</Label>
        <Input
          id="link_to"
          value={formData.link_to}
          onChange={(e) => setFormData({ ...formData, link_to: e.target.value })}
          placeholder="Ex: /plataforma ou /audiofy"
        />
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
        label="Imagem 300×580 *"
        accept="image"
        folder="highlights"
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
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Lançamentos</h2>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Novo Lançamento
            </Button>
          </div>

          <Card className="glass border-primary/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="w-20">Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : highlights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum lançamento cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  highlights.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>
                        <img src={h.image_url} alt={h.title} className="h-16 w-8 rounded object-cover" />
                      </TableCell>
                      <TableCell className="font-medium">{h.title || '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{h.link_to || '—'}</TableCell>
                      <TableCell className="text-center">{h.display_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          h.available ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {h.available ? 'Disponível' : 'Oculto'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleAvailability(h.id, h.available)}>
                            {h.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(h)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(h.id)}>
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

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
                <DialogDescription>Adicione uma imagem ao carrossel de lançamentos.</DialogDescription>
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

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Lançamento</DialogTitle>
                <DialogDescription>Atualize os dados do lançamento.</DialogDescription>
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

export default HighlightsManager;
