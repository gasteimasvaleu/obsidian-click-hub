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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LayoutGrid, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface CourseModule {
  id: string;
  course_id: string;
}

interface Carousel {
  id: string;
  course_id: string;
  title: string | null;
  description: string | null;
  display_order: number;
  available: boolean;
  course?: Course;
}

interface CarouselFormData {
  course_id: string;
  title: string;
  description: string;
  available: boolean;
}

export default function CarouselsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [formData, setFormData] = useState<CarouselFormData>({
    course_id: "",
    title: "",
    description: "",
    available: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all courses
  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ["admin_courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description")
        .order("title");
      if (error) throw error;
      return data as Course[];
    },
  });

  // Fetch all modules to count per course
  const { data: modules } = useQuery({
    queryKey: ["admin_modules_count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_modules")
        .select("id, course_id")
        .eq("available", true);
      if (error) throw error;
      return data as CourseModule[];
    },
  });

  // Fetch carousels with course info
  const { data: carousels, isLoading: loadingCarousels } = useQuery({
    queryKey: ["admin_carousels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_carousels")
        .select(`
          *,
          course:courses(id, title, description)
        `)
        .order("display_order");
      if (error) throw error;
      return data as Carousel[];
    },
  });

  // Count modules per course
  const moduleCountByCourse = modules?.reduce((acc, mod) => {
    acc[mod.course_id] = (acc[mod.course_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Create carousel mutation
  const createMutation = useMutation({
    mutationFn: async (data: CarouselFormData) => {
      const maxOrder = carousels?.reduce((max, c) => Math.max(max, c.display_order), -1) ?? -1;
      const { error } = await supabase.from("platform_carousels").insert({
        course_id: data.course_id,
        title: data.title || null,
        description: data.description || null,
        display_order: maxOrder + 1,
        available: data.available,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_carousels"] });
      toast({ title: "Carrossel criado com sucesso!" });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar carrossel",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update carousel mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CarouselFormData }) => {
      const { error } = await supabase
        .from("platform_carousels")
        .update({
          course_id: data.course_id,
          title: data.title || null,
          description: data.description || null,
          available: data.available,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_carousels"] });
      toast({ title: "Carrossel atualizado com sucesso!" });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar carrossel",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete carousel mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("platform_carousels")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_carousels"] });
      toast({ title: "Carrossel excluído com sucesso!" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir carrossel",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle availability mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase
        .from("platform_carousels")
        .update({ available })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_carousels"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar disponibilidade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCarousel(null);
    setFormData({
      course_id: "",
      title: "",
      description: "",
      available: true,
    });
  };

  const handleEdit = (carousel: Carousel) => {
    setEditingCarousel(carousel);
    setFormData({
      course_id: carousel.course_id,
      title: carousel.title || "",
      description: carousel.description || "",
      available: carousel.available,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id) {
      toast({
        title: "Selecione um curso",
        variant: "destructive",
      });
      return;
    }

    if (editingCarousel) {
      updateMutation.mutate({ id: editingCarousel.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const selectedCourseModuleCount = formData.course_id
    ? moduleCountByCourse[formData.course_id] || 0
    : 0;

  const isLoading = loadingCourses || loadingCarousels;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <LayoutGrid className="h-6 w-6" />
              Gerenciar Carrosseis
            </h1>
            <p className="text-muted-foreground">
              Configure os carrosseis de módulos exibidos na página da plataforma
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Carrossel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCarousel ? "Editar Carrossel" : "Novo Carrossel"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Curso *</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, course_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.course_id && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Info className="h-4 w-4" />
                    <span>
                      Este curso tem{" "}
                      <strong>{selectedCourseModuleCount}</strong> módulo(s)
                      disponível(is)
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Título (opcional)</Label>
                  <Input
                    id="title"
                    placeholder="Deixe vazio para usar o título do curso"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Deixe vazio para usar a descrição do curso"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, available: checked })
                    }
                  />
                  <Label htmlFor="available">Disponível na plataforma</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
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
                    {editingCarousel ? "Salvar" : "Criar Carrossel"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : carousels && carousels.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Módulos</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carousels.map((carousel) => (
                  <TableRow key={carousel.id}>
                    <TableCell className="font-medium">
                      {carousel.display_order + 1}
                    </TableCell>
                    <TableCell>
                      {carousel.title || (
                        <span className="text-muted-foreground italic">
                          (título do curso)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{carousel.course?.title || "—"}</TableCell>
                    <TableCell>
                      {moduleCountByCourse[carousel.course_id] || 0}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={carousel.available}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({
                            id: carousel.id,
                            available: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(carousel)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (
                              confirm(
                                "Tem certeza que deseja excluir este carrossel?"
                              )
                            ) {
                              deleteMutation.mutate(carousel.id);
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
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum carrossel configurado
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie carrosseis para exibir módulos de cursos na página da
              plataforma
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeiro carrossel
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
