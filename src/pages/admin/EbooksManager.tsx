import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, FileText, Music } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Ebook {
  id: string;
  title: string;
  description: string;
  pages: number | null;
  format: string;
  file_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  available: boolean;
  created_at: string;
}

const EbooksManager = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'ebook' | 'audiobook'>('ebook');
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('criativos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('criativos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Por favor, selecione um arquivo');
      return;
    }

    setUploading(true);

    try {
      // Upload file
      const fileUrl = await uploadFile(file);
      
      if (!fileUrl) {
        toast.error('Erro ao fazer upload do arquivo');
        setUploading(false);
        return;
      }

      // Determine format based on content type
      const format = contentType === 'audiobook' 
        ? file.name.split('.').pop()?.toUpperCase() || 'MP3'
        : 'PDF';

      // Insert into database
      const { error } = await supabase.from('ebooks').insert({
        title,
        description,
        pages: contentType === 'ebook' ? pages : null,
        duration: contentType === 'audiobook' ? duration : null,
        format,
        file_url: fileUrl,
        available: false, // Start as unavailable
      });

      if (error) {
        toast.error('Erro ao salvar ebook');
        console.error(error);
      } else {
        toast.success('Conteúdo criado com sucesso');
        resetForm();
        setDialogOpen(false);
        loadEbooks();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao criar conteúdo');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPages(null);
    setDuration(null);
    setContentType('ebook');
    setFile(null);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('ebooks')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar conteúdo');
    } else {
      toast.success('Conteúdo atualizado com sucesso');
      loadEbooks();
    }
  };

  const deleteEbook = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;

    const { error } = await supabase.from('ebooks').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir conteúdo');
    } else {
      toast.success('Conteúdo excluído com sucesso');
      loadEbooks();
    }
  };

  const isAudioBook = (format: string) => {
    return format.toLowerCase().includes('mp3') || 
           format.toLowerCase().includes('m4a') || 
           format.toLowerCase().includes('audio');
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Ebooks & Audiobooks</h2>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Conteúdo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do ebook ou audiobook
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contentType">Tipo de Conteúdo</Label>
                    <Select
                      value={contentType}
                      onValueChange={(value: 'ebook' | 'audiobook') => setContentType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ebook">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Ebook (PDF)
                          </div>
                        </SelectItem>
                        <SelectItem value="audiobook">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Audiobook (MP3/M4A)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {contentType === 'ebook' ? (
                    <div>
                      <Label htmlFor="pages">Número de Páginas</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={pages || ''}
                        onChange={(e) => setPages(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration || ''}
                        onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="file">
                      Arquivo {contentType === 'ebook' ? '(PDF)' : '(MP3/M4A)'}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept={contentType === 'ebook' ? '.pdf' : '.mp3,.m4a'}
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Criar Conteúdo
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass border-primary/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
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
                      Nenhum conteúdo cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  ebooks.map((ebook) => (
                    <TableRow key={ebook.id}>
                      <TableCell>
                        {isAudioBook(ebook.format) ? (
                          <Music className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{ebook.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{ebook.description}</TableCell>
                      <TableCell>
                        {isAudioBook(ebook.format) 
                          ? `${ebook.duration || '?'} min` 
                          : `${ebook.pages || '?'} pág`}
                      </TableCell>
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
