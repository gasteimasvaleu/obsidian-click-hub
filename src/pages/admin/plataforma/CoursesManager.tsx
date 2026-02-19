import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaUploader } from "@/components/plataforma/MediaUploader";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  thumbnail: string | null;
  video_desktop: string | null;
  video_mobile: string | null;
  use_video: boolean | null;
  page_image_desktop: string | null;
  page_image_mobile: string | null;
  display_order: number;
  available: boolean | null;
}

type CourseFormData = Omit<Course, "id">;

const defaultFormData: CourseFormData = {
  title: "",
  description: "",
  banner_desktop: null,
  banner_mobile: null,
  thumbnail: null,
  video_desktop: null,
  video_mobile: null,
  use_video: false,
  page_image_desktop: null,
  page_image_mobile: null,
  display_order: 0,
  available: false,
};

export default function CoursesManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as Course[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const { error } = await supabase.from("courses").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso criado com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao criar curso: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      const { error } = await supabase.from("courses").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso atualizado com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar curso: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir curso: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      ...defaultFormData,
      display_order: (courses?.length || 0) + 1,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      banner_desktop: course.banner_desktop,
      banner_mobile: course.banner_mobile,
      thumbnail: course.thumbnail,
      video_desktop: course.video_desktop,
      video_mobile: course.video_mobile,
      use_video: course.use_video,
      page_image_desktop: course.page_image_desktop,
      page_image_mobile: course.page_image_mobile,
      display_order: course.display_order,
      available: course.available,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourse(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleAvailability = (course: Course) => {
    updateMutation.mutate({
      id: course.id,
      data: { available: !course.available },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Cursos</h1>
            <p className="text-muted-foreground">
              Adicione e gerencie os cursos da plataforma
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Curso
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum curso cadastrado
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {course.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAvailability(course)}
                      >
                        {course.available ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Excluir este curso?")) {
                              deleteMutation.mutate(course.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Editar Curso" : "Novo Curso"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="use_video"
                      checked={formData.use_video || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, use_video: checked })
                      }
                    />
                    <Label htmlFor="use_video">Usar vídeo no header</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={formData.available || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, available: checked })
                      }
                    />
                    <Label htmlFor="available">Publicado</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Thumbnail (Carrossel)</h3>
                <MediaUploader
                  label="Thumbnail"
                  accept="image"
                  folder="courses/thumbnails"
                  currentUrl={formData.thumbnail || undefined}
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, thumbnail: url })
                  }
                  onRemove={() => setFormData({ ...formData, thumbnail: null })}
                  dimensions="300x580"
                  aspectRatio={300 / 580}
                  maxSizeMB={5}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Imagens da Página do Curso</h3>
                <p className="text-sm text-muted-foreground">
                  Imagens exibidas no header da página individual do curso
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <MediaUploader
                    label="Imagem Desktop"
                    accept="image"
                    folder="courses/page-images/desktop"
                    currentUrl={formData.page_image_desktop || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, page_image_desktop: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, page_image_desktop: null })
                    }
                    dimensions="1440x730"
                    aspectRatio={1440 / 730}
                    maxSizeMB={5}
                  />
                  <MediaUploader
                    label="Imagem Mobile"
                    accept="image"
                    folder="courses/page-images/mobile"
                    currentUrl={formData.page_image_mobile || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, page_image_mobile: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, page_image_mobile: null })
                    }
                    dimensions="1080x1920"
                    aspectRatio={1080 / 1920}
                    maxSizeMB={5}
                  />
                </div>
              </div>

              {formData.use_video ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Vídeos do Header</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <MediaUploader
                      label="Vídeo Desktop"
                      accept="video"
                      folder="courses/videos/desktop"
                      currentUrl={formData.video_desktop || undefined}
                      onUploadSuccess={(url) =>
                        setFormData({ ...formData, video_desktop: url })
                      }
                      onRemove={() =>
                        setFormData({ ...formData, video_desktop: null })
                      }
                      aspectRatio={16 / 9}
                      maxSizeMB={500}
                    />
                    <MediaUploader
                      label="Vídeo Mobile"
                      accept="video"
                      folder="courses/videos/mobile"
                      currentUrl={formData.video_mobile || undefined}
                      onUploadSuccess={(url) =>
                        setFormData({ ...formData, video_mobile: url })
                      }
                      onRemove={() =>
                        setFormData({ ...formData, video_mobile: null })
                      }
                      aspectRatio={9 / 16}
                      maxSizeMB={500}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold">Banners do Header</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <MediaUploader
                      label="Banner Desktop"
                      accept="image"
                      folder="courses/banners/desktop"
                      currentUrl={formData.banner_desktop || undefined}
                      onUploadSuccess={(url) =>
                        setFormData({ ...formData, banner_desktop: url })
                      }
                      onRemove={() =>
                        setFormData({ ...formData, banner_desktop: null })
                      }
                      dimensions="2560x1440"
                      aspectRatio={2560 / 1440}
                      maxSizeMB={5}
                    />
                    <MediaUploader
                      label="Banner Mobile"
                      accept="image"
                      folder="courses/banners/mobile"
                      currentUrl={formData.banner_mobile || undefined}
                      onUploadSuccess={(url) =>
                        setFormData({ ...formData, banner_mobile: url })
                      }
                      onRemove={() =>
                        setFormData({ ...formData, banner_mobile: null })
                      }
                      dimensions="1080x1920"
                      aspectRatio={1080 / 1920}
                      maxSizeMB={5}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCourse ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
