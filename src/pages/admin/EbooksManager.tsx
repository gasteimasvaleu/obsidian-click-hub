import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Eye, EyeOff, Upload, FileText, Music, Video, Link } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  content_type: string;
  video_url: string | null;
}

type ContentType = 'ebook' | 'audiobook' | 'video';

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
  const [contentType, setContentType] = useState<ContentType>('ebook');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSource, setVideoSource] = useState<'upload' | 'link'>('upload');

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
      toast.error('Erro ao carregar conteúdo');
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
    
    // Validações
    if (contentType === 'video' && videoSource === 'link' && !videoUrl) {
      toast.error('Por favor, insira o link do vídeo');
      return;
    }
    
    if (contentType !== 'video' && !file) {
      toast.error('Por favor, selecione um arquivo');
      return;
    }
    
    if (contentType === 'video' && videoSource === 'upload' && !file) {
      toast.error('Por favor, selecione um arquivo de vídeo');
      return;
    }

    setUploading(true);

    try {
      let fileUrl: string | null = null;
      
      // Upload file se necessário
      if (file) {
        fileUrl = await uploadFile(file);
        
        if (!fileUrl) {
          toast.error('Erro ao fazer upload do arquivo');
          setUploading(false);
          return;
        }
      }

      // Determinar formato baseado no tipo de conteúdo
      let format = 'PDF';
      if (contentType === 'audiobook') {
        format = file?.name.split('.').pop()?.toUpperCase() || 'MP3';
      } else if (contentType === 'video') {
        if (videoSource === 'link') {
          format = 'VIDEO_LINK';
        } else {
          format = file?.name.split('.').pop()?.toUpperCase() || 'MP4';
        }
      }

      // Insert into database
      const { error } = await supabase.from('ebooks').insert({
        title,
        description,
        pages: contentType === 'ebook' ? pages : null,
        duration: contentType !== 'ebook' ? duration : null,
        format,
        file_url: fileUrl,
        video_url: contentType === 'video' && videoSource === 'link' ? videoUrl : null,
        content_type: contentType,
        available: false,
      });

      if (error) {
        toast.error('Erro ao salvar conteúdo');
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
    setVideoUrl('');
    setVideoSource('upload');
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

  const getContentIcon = (ebook: Ebook) => {
    if (ebook.content_type === 'video') {
      return <Video className="h-4 w-4 text-primary" />;
    }
    if (ebook.content_type === 'audiobook') {
      return <Music className="h-4 w-4 text-primary" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const getContentLabel = (ebook: Ebook) => {
    if (ebook.content_type === 'video') return 'Vídeo';
    if (ebook.content_type === 'audiobook') return 'Áudio';
    return 'Ebook';
  };

  const getAcceptedFormats = () => {
    switch (contentType) {
      case 'ebook':
        return '.pdf';
      case 'audiobook':
        return '.mp3,.m4a,.wav';
      case 'video':
        return '.mp4,.webm,.mov';
      default:
        return '*';
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Gerenciar Biblioteca</h2>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Conteúdo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do ebook, audiobook ou vídeo
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contentType">Tipo de Conteúdo</Label>
                    <Select
                      value={contentType}
                      onValueChange={(value: ContentType) => {
                        setContentType(value);
                        setFile(null);
                        setVideoUrl('');
                      }}
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
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Vídeo (MP4/Link)
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

                  {contentType === 'ebook' && (
                    <div>
                      <Label htmlFor="pages">Número de Páginas</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={pages || ''}
                        onChange={(e) => setPages(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                  )}

                  {(contentType === 'audiobook' || contentType === 'video') && (
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

                  {contentType === 'video' && (
                    <div>
                      <Label>Fonte do Vídeo</Label>
                      <Tabs value={videoSource} onValueChange={(v) => setVideoSource(v as 'upload' | 'link')} className="mt-2">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload
                          </TabsTrigger>
                          <TabsTrigger value="link" className="gap-2">
                            <Link className="w-4 h-4" />
                            Link Externo
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="mt-3">
                          <Input
                            type="file"
                            accept={getAcceptedFormats()}
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formatos aceitos: MP4, WEBM, MOV
                          </p>
                        </TabsContent>
                        <TabsContent value="link" className="mt-3">
                          <Input
                            placeholder="https://youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Cole o link do YouTube, Vimeo ou outro player
                          </p>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}

                  {contentType !== 'video' && (
                    <div>
                      <Label htmlFor="file">
                        Arquivo {contentType === 'ebook' ? '(PDF)' : '(MP3/M4A)'}
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept={getAcceptedFormats()}
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  )}

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
                        <div className="flex items-center gap-2">
                          {getContentIcon(ebook)}
                          <span className="text-xs text-muted-foreground">
                            {getContentLabel(ebook)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{ebook.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{ebook.description}</TableCell>
                      <TableCell>
                        {ebook.content_type === 'ebook' 
                          ? `${ebook.pages || '?'} pág` 
                          : `${ebook.duration || '?'} min`}
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
