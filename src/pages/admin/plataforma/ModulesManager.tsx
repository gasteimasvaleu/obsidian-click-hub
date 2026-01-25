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
import { MediaUploader } from "@/components/plataforma/MediaUploader";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  thumbnail: string | null;
  display_order: number;
  available: boolean | null;
}

type ModuleFormData = Omit<CourseModule, "id">;

const defaultFormData: ModuleFormData = {
  course_id: "",
  title: "",
  description: "",
  banner_desktop: null,
  banner_mobile: null,
  thumbnail: null,
  display_order: 0,
  available: false,
};

export default function ModulesManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>(defaultFormData);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");

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

  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin-modules", selectedCourseFilter],
    queryFn: async () => {
      let query = supabase
        .from("course_modules")
        .select("*")
        .order("display_order");

      if (selectedCourseFilter !== "all") {
        query = query.eq("course_id", selectedCourseFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CourseModule[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ModuleFormData) => {
      const { error } = await supabase.from("course_modules").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo criado com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao criar módulo: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourseModule> }) => {
      const { error } = await supabase.from("course_modules").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo atualizado com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar módulo: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir módulo: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingModule(null);
    setFormData({
      ...defaultFormData,
      course_id: selectedCourseFilter !== "all" ? selectedCourseFilter : "",
      display_order: (modules?.length || 0) + 1,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (module: CourseModule) => {
    setEditingModule(module);
    setFormData({
      course_id: module.course_id,
      title: module.title,
      description: module.description,
      banner_desktop: module.banner_desktop,
      banner_mobile: module.banner_mobile,
      thumbnail: module.thumbnail,
      display_order: module.display_order,
      available: module.available,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingModule(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id) {
      toast.error("Selecione um curso");
      return;
    }
    if (editingModule) {
      updateMutation.mutate({ id: editingModule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleAvailability = (module: CourseModule) => {
    updateMutation.mutate({
      id: module.id,
      data: { available: !module.available },
    });
  };

  const getCourseName = (courseId: string) => {
    return courses?.find((c) => c.id === courseId)?.title || "—";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Módulos</h1>
            <p className="text-muted-foreground">
              Adicione e gerencie os módulos dos cursos
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Módulo
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por curso" />
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
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : !modules || modules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum módulo cadastrado
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="text-muted-foreground">
                      {getCourseName(module.course_id)}
                    </TableCell>
                    <TableCell className="font-medium">{module.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {module.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAvailability(module)}
                      >
                        {module.available ? (
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
                          onClick={() => handleOpenEdit(module)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Excluir este módulo?")) {
                              deleteMutation.mutate(module.id);
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
                {editingModule ? "Editar Módulo" : "Novo Módulo"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Curso</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, course_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
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

              <div className="space-y-4">
                <h3 className="font-semibold">Thumbnail (Lista)</h3>
                <MediaUploader
                  label="Thumbnail"
                  accept="image"
                  folder="modules/thumbnails"
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
                <h3 className="font-semibold">Banners do Header</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <MediaUploader
                    label="Banner Desktop"
                    accept="image"
                    folder="modules/banners/desktop"
                    currentUrl={formData.banner_desktop || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, banner_desktop: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, banner_desktop: null })
                    }
                    dimensions="1440x730"
                    aspectRatio={1440 / 730}
                    maxSizeMB={5}
                  />
                  <MediaUploader
                    label="Banner Mobile"
                    accept="image"
                    folder="modules/banners/mobile"
                    currentUrl={formData.banner_mobile || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, banner_mobile: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, banner_mobile: null })
                    }
                    dimensions="300x580"
                    aspectRatio={300 / 580}
                    maxSizeMB={5}
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
                  {editingModule ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
