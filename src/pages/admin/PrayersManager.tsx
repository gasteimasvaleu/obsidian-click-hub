import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, BookHeart } from "lucide-react";

interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  icon_name: string;
  display_order: number;
  available: boolean;
}

const categories = [
  // Orações tradicionais
  { id: "essencial", name: "Essencial" },
  { id: "mariana", name: "Maria" },
  { id: "espirito_santo", name: "Espírito Santo" },
  { id: "eucaristica", name: "Eucarística" },
  { id: "misericordia", name: "Misericórdia" },
  { id: "penitencia", name: "Penitência" },
  { id: "santos", name: "Santos" },
  { id: "sacramentos", name: "Sacramentos" },
  { id: "vocacao", name: "Vocação" },
  // Orações do dia a dia
  { id: "protecao", name: "Proteção" },
  { id: "refeicao", name: "Refeição" },
  { id: "manha", name: "Manhã" },
  { id: "noite", name: "Noite" },
  // Orações infantis
  { id: "familia", name: "Família" },
  { id: "amigos", name: "Amigos" },
  { id: "escola", name: "Escola" },
  { id: "gratidao", name: "Gratidão" },
  { id: "saude", name: "Saúde" },
];

const icons = [
  { id: "book-open", name: "Livro (BookOpen)" },
  { id: "star", name: "Estrela (Star)" },
  { id: "shield", name: "Escudo (Shield)" },
  { id: "heart", name: "Coração (Heart)" },
  { id: "utensils-crossed", name: "Talheres (UtensilsCrossed)" },
  { id: "sparkles", name: "Brilhos (Sparkles)" },
  { id: "church", name: "Igreja (Church)" },
  { id: "heart-handshake", name: "Misericórdia (HeartHandshake)" },
  { id: "users", name: "Família (Users)" },
  { id: "graduation-cap", name: "Escola (GraduationCap)" },
  { id: "moon", name: "Lua (Moon)" },
  { id: "sun", name: "Sol (Sun)" },
  { id: "crown", name: "Coroa (Crown)" },
  { id: "droplets", name: "Gotas (Droplets)" },
  { id: "compass", name: "Bússola (Compass)" },
];

const PrayersManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "essencial",
    icon_name: "book-open",
    display_order: 0,
    available: true,
  });

  const queryClient = useQueryClient();

  // Fetch prayers
  const { data: prayers = [], isLoading } = useQuery({
    queryKey: ["admin-prayers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prayers")
        .select("*")
        .order("category")
        .order("display_order");

      if (error) throw error;
      return data as Prayer[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("prayers")
          .update(data)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("prayers").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prayers"] });
      toast.success(editingPrayer ? "Oração atualizada!" : "Oração criada!");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Erro ao salvar oração");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("prayers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prayers"] });
      toast.success("Oração removida!");
    },
    onError: () => {
      toast.error("Erro ao remover oração");
    },
  });

  // Toggle available mutation
  const toggleAvailableMutation = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase
        .from("prayers")
        .update({ available })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prayers"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const handleOpenDialog = (prayer?: Prayer) => {
    if (prayer) {
      setEditingPrayer(prayer);
      setFormData({
        title: prayer.title,
        content: prayer.content,
        category: prayer.category,
        icon_name: prayer.icon_name,
        display_order: prayer.display_order,
        available: prayer.available,
      });
    } else {
      setEditingPrayer(null);
      setFormData({
        title: "",
        content: "",
        category: "essencial",
        icon_name: "book-open",
        display_order: 0,
        available: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPrayer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(
      editingPrayer ? { ...formData, id: editingPrayer.id } : formData
    );
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookHeart className="text-primary" size={28} />
            <h1 className="text-2xl font-bold text-primary">
              Gerenciar Orações
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus size={16} className="mr-2" />
                Nova Oração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPrayer ? "Editar Oração" : "Nova Oração"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
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

                <div>
                  <Label htmlFor="content">Conteúdo da Oração</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon">Ícone</Label>
                    <Select
                      value={formData.icon_name}
                      onValueChange={(value) =>
                        setFormData({ ...formData, icon_name: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {icons.map((icon) => (
                          <SelectItem key={icon.id} value={icon.id}>
                            {icon.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Ordem de Exibição</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, available: checked })
                      }
                    />
                    <Label htmlFor="available">Disponível</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Prayers Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : prayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nenhuma oração cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                prayers.map((prayer) => (
                  <TableRow key={prayer.id}>
                    <TableCell className="font-medium">{prayer.title}</TableCell>
                    <TableCell>{getCategoryName(prayer.category)}</TableCell>
                    <TableCell>{prayer.display_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={prayer.available}
                        onCheckedChange={(checked) =>
                          toggleAvailableMutation.mutate({
                            id: prayer.id,
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
                          onClick={() => handleOpenDialog(prayer)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (
                              confirm("Tem certeza que deseja remover esta oração?")
                            ) {
                              deleteMutation.mutate(prayer.id);
                            }
                          }}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PrayersManager;
