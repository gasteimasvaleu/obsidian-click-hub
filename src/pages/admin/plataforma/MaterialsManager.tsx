import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";

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
}

interface LessonMaterial {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  display_order: number;
}

type MaterialFormData = Omit<LessonMaterial, "id">;

const defaultFormData: MaterialFormData = {
  lesson_id: "",
  title: "",
  file_url: "",
  file_type: "",
  file_size: null,
  display_order: 0,
};

export default function MaterialsManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<MaterialFormData>(defaultFormData);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");

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

  const { data: lessons } = useQuery({
    queryKey: ["admin-lessons-select", selectedModule],
    queryFn: async () => {
      let query = supabase
        .from("module_lessons")
        .select("id, module_id, title")
        .order("display_order");

      if (selectedModule !== "all") {
        query = query.eq("module_id", selectedModule);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ModuleLesson[];
    },
  });

  const { data: materials, isLoading } = useQuery({
    queryKey: ["admin-materials", selectedLesson],
    queryFn: async () => {
      let query = supabase
        .from("lesson_materials")
        .select("*")
        .order("display_order");

      if (selectedLesson !== "all") {
        query = query.eq("lesson_id", selectedLesson);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as LessonMaterial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      const { error } = await supabase.from("lesson_materials").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      toast.success("Material adicionado com sucesso!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao adicionar material: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lesson_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
      toast.success("Material excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir material: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setFormData({
      ...defaultFormData,
      lesson_id: selectedLesson !== "all" ? selectedLesson : "",
      display_order: (materials?.length || 0) + 1,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lesson_id) {
      toast.error("Selecione uma aula");
      return;
    }
    if (!formData.file_url) {
      toast.error("Faça upload do arquivo");
      return;
    }
    createMutation.mutate(formData);
  };

  const getLessonName = (lessonId: string) => {
    return lessons?.find((l) => l.id === lessonId)?.title || "—";
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("document")) return "DOC";
    if (fileType.includes("sheet") || fileType.includes("excel")) return "XLS";
    return "ARQUIVO";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Materiais</h1>
            <p className="text-muted-foreground">
              Adicione materiais complementares às aulas
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Material
          </Button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Select
            value={selectedCourse}
            onValueChange={(v) => {
              setSelectedCourse(v);
              setSelectedModule("all");
              setSelectedLesson("all");
            }}
          >
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

          <Select
            value={selectedModule}
            onValueChange={(v) => {
              setSelectedModule(v);
              setSelectedLesson("all");
            }}
          >
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

          <Select value={selectedLesson} onValueChange={setSelectedLesson}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Aula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as aulas</SelectItem>
              {lessons?.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : !materials || materials.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum material cadastrado
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aula</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-24">Tipo</TableHead>
                  <TableHead className="w-24">Tamanho</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="text-muted-foreground">
                      {getLessonName(material.lesson_id)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {material.title}
                      </div>
                    </TableCell>
                    <TableCell>{getFileTypeLabel(material.file_type)}</TableCell>
                    <TableCell>{formatFileSize(material.file_size)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(material.file_url, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Excluir este material?")) {
                              deleteMutation.mutate(material.id);
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Material</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Aula</Label>
                <Select
                  value={formData.lesson_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, lesson_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Material</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <MediaUploader
                label="Arquivo"
                accept="document"
                folder="materials"
                currentUrl={formData.file_url || undefined}
                onUploadSuccess={(url) => {
                  // Try to detect file type from URL
                  const ext = url.split(".").pop()?.toLowerCase();
                  let fileType = "application/octet-stream";
                  if (ext === "pdf") fileType = "application/pdf";
                  else if (ext === "doc" || ext === "docx")
                    fileType = "application/msword";
                  else if (ext === "xls" || ext === "xlsx")
                    fileType = "application/vnd.ms-excel";

                  setFormData({ ...formData, file_url: url, file_type: fileType });
                }}
                onRemove={() =>
                  setFormData({ ...formData, file_url: "", file_type: "" })
                }
                maxSizeMB={20}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
