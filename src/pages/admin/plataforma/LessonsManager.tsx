import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MediaUploader } from "@/components/plataforma/MediaUploader";
import { Plus, Pencil, Trash2, Eye, EyeOff, Clock, Check } from "lucide-react";
import { toast } from "sonner";

// Helper functions for video URL parsing
const extractVideoId = (url: string): { type: "youtube" | "vimeo"; id: string } | null => {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", id: vimeoMatch[1] };

  return null;
};

const getEmbedUrl = (videoInfo: { type: string; id: string }): string => {
  if (videoInfo.type === "youtube") {
    return `https://www.youtube.com/embed/${videoInfo.id}`;
  }
  if (videoInfo.type === "vimeo") {
    return `https://player.vimeo.com/video/${videoInfo.id}`;
  }
  return "";
};

interface Course {
  id: string;
  title: string;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
}

interface ModuleLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  video_url: string | null;
  video_source: string | null;
  external_content_url: string | null;
  duration: number | null;
  display_order: number;
  available: boolean | null;
}

type LessonFormData = Omit<ModuleLesson, "id">;

const defaultFormData: LessonFormData = {
  module_id: "",
  title: "",
  description: "",
  thumbnail: null,
  video_url: null,
  video_source: "upload",
  external_content_url: null,
  duration: 0,
  display_order: 0,
  available: false,
};

export default function LessonsManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ModuleLesson | null>(null);
  const [formData, setFormData] = useState<LessonFormData>(defaultFormData);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  // Compute video info for preview
  const videoInfo = useMemo(() => {
    if (formData.video_source === "external" && formData.video_url) {
      return extractVideoId(formData.video_url);
    }
    return null;
  }, [formData.video_source, formData.video_url]);

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .order("display_order");
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: modules } = useQuery({
    queryKey: ["admin-modules-select", selectedCourse],
    queryFn: async () => {
      let query = supabase
        .from("course_modules")
        .select("id, course_id, title")
        .order("display_order");

      if (selectedCourse !== "all") {
        query = query.eq("course_id", selectedCourse);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CourseModule[];
    },
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["admin-lessons", selectedModule],
    queryFn: async () => {
      let query = supabase
        .from("module_lessons")
        .select("*")
        .order("display_order");

      if (selectedModule !== "all") {
        query = query.eq("module_id", selectedModule);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ModuleLesson[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const { error } = await supabase.from("module_lessons").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula criada com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao criar aula: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ModuleLesson> }) => {
      const { error } = await supabase.from("module_lessons").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula atualizada com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar aula: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir aula: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormData({
      ...defaultFormData,
      module_id: selectedModule !== "all" ? selectedModule : "",
      display_order: (lessons?.length || 0) + 1,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (lesson: ModuleLesson) => {
    setEditingLesson(lesson);
    setFormData({
      module_id: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      thumbnail: lesson.thumbnail,
      video_url: lesson.video_url,
      video_source: lesson.video_source,
      external_content_url: lesson.external_content_url,
      duration: lesson.duration,
      display_order: lesson.display_order,
      available: lesson.available,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLesson(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.module_id) {
      toast.error("Selecione um módulo");
      return;
    }
    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleAvailability = (lesson: ModuleLesson) => {
    updateMutation.mutate({
      id: lesson.id,
      data: { available: !lesson.available },
    });
  };

  const getModuleName = (moduleId: string) => {
    return modules?.find((m) => m.id === moduleId)?.title || "—";
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Aulas</h1>
            <p className="text-muted-foreground">
              Adicione e gerencie as aulas dos módulos
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Aula
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={selectedCourse} onValueChange={(v) => {
            setSelectedCourse(v);
            setSelectedModule("all");
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os módulos</SelectItem>
              {modules?.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : !lessons || lessons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma aula cadastrada
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-24">Duração</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="text-muted-foreground">
                      {getModuleName(lesson.module_id)}
                    </TableCell>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(lesson.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAvailability(lesson)}
                      >
                        {lesson.available ? (
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
                          onClick={() => handleOpenEdit(lesson)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Excluir esta aula?")) {
                              deleteMutation.mutate(lesson.id);
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
                {editingLesson ? "Editar Aula" : "Nova Aula"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Módulo</Label>
                  <Select
                    value={formData.module_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, module_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules?.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={0}
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
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
                <h3 className="font-semibold">Vídeo da Aula</h3>
                <RadioGroup
                  value={formData.video_source || "upload"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      video_source: value,
                      video_url: null,
                    })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload">Upload</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="external" />
                    <Label htmlFor="external">Link Externo</Label>
                  </div>
                </RadioGroup>

                {formData.video_source === "upload" ? (
                  <MediaUploader
                    label="Vídeo"
                    accept="video"
                    folder="lessons/videos"
                    currentUrl={formData.video_url || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, video_url: url })
                    }
                    onRemove={() => setFormData({ ...formData, video_url: null })}
                    aspectRatio={16 / 9}
                    maxSizeMB={1000}
                  />
                ) : (
                  <div className="space-y-3">
                    <Label>URL do Vídeo (YouTube/Vimeo)</Label>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.video_url || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, video_url: e.target.value })
                      }
                    />
                    
                    {/* Video Preview */}
                    {videoInfo && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          Vídeo {videoInfo.type === "youtube" ? "YouTube" : "Vimeo"} detectado
                        </div>
                        <AspectRatio ratio={16 / 9} className="bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={getEmbedUrl(videoInfo)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </AspectRatio>
                      </div>
                    )}
                    
                    {formData.video_url && !videoInfo && (
                      <p className="text-sm text-destructive">
                        URL não reconhecida. Use links do YouTube ou Vimeo.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Thumbnail</h3>
                <MediaUploader
                  label="Thumbnail"
                  accept="image"
                  folder="lessons/thumbnails"
                  currentUrl={formData.thumbnail || undefined}
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, thumbnail: url })
                  }
                  onRemove={() => setFormData({ ...formData, thumbnail: null })}
                  dimensions="1440x730"
                  aspectRatio={1440 / 730}
                  maxSizeMB={5}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Conteúdo Externo (opcional)</h3>
                <div className="space-y-2">
                  <Label>URL para abrir em modal</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.external_content_url || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        external_content_url: e.target.value || null,
                      })
                    }
                  />
                </div>
              </div>

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
                  {editingLesson ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
