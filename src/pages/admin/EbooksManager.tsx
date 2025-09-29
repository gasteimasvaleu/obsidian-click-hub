import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Ebook {
  id: string;
  title: string;
  description: string;
  pages: number;
  format: string;
  available: boolean;
  created_at: string;
}

const EbooksManager = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar ebooks');
      console.error(error);
    } else {
      setEbooks(data || []);
    }
    setLoading(false);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('ebooks')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar ebook');
    } else {
      toast.success('Ebook atualizado com sucesso');
      loadEbooks();
    }
  };

  const deleteEbook = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ebook?')) return;

    const { error } = await supabase.from('ebooks').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir ebook');
    } else {
      toast.success('Ebook excluído com sucesso');
      loadEbooks();
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Ebooks</h2>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Ebook
            </Button>
          </div>

          <Card className="glass border-primary/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Páginas</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : ebooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum ebook cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  ebooks.map((ebook) => (
                    <TableRow key={ebook.id}>
                      <TableCell className="font-medium">{ebook.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{ebook.description}</TableCell>
                      <TableCell>{ebook.pages}</TableCell>
                      <TableCell>{ebook.format}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ebook.available
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {ebook.available ? 'Disponível' : 'Oculto'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAvailability(ebook.id, ebook.available)}
                          >
                            {ebook.available ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEbook(ebook.id)}
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
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default EbooksManager;
