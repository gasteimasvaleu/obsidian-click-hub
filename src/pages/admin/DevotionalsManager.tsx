import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function DevotionalsManager() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    book_name: "",
    chapter: 0,
    verse_start: 0,
    verse_end: null as number | null,
    verse_text: "",
    introduction: "",
    reflection: "",
    question: "",
    practical_applications: "",
    prayer: "",
    devotional_date: format(new Date(), 'yyyy-MM-dd'),
    available: true
  });

  const { data: devotionals } = useQuery({
    queryKey: ['devotionals-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_devotionals')
        .select('*')
        .order('devotional_date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('daily_devotionals')
        .insert(formData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotionals-admin'] });
      toast.success('Devocional criado com sucesso!');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('daily_devotionals')
        .update(formData)
        .eq('id', editingDevotional.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotionals-admin'] });
      toast.success('Devocional atualizado com sucesso!');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('daily_devotionals')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotionals-admin'] });
      toast.success('Devocional excluído com sucesso!');
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      theme: "",
      book_name: "",
      chapter: 0,
      verse_start: 0,
      verse_end: null,
      verse_text: "",
      introduction: "",
      reflection: "",
      question: "",
      practical_applications: "",
      prayer: "",
      devotional_date: format(new Date(), 'yyyy-MM-dd'),
      available: true
    });
    setEditingDevotional(null);
    setShowDialog(false);
  };

  const handleEdit = (devotional: any) => {
    setEditingDevotional(devotional);
    setFormData({
      title: devotional.title,
      theme: devotional.theme,
      book_name: devotional.book_name,
      chapter: devotional.chapter,
      verse_start: devotional.verse_start,
      verse_end: devotional.verse_end,
      verse_text: devotional.verse_text,
      introduction: devotional.introduction,
      reflection: devotional.reflection,
      question: devotional.question,
      practical_applications: devotional.practical_applications,
      prayer: devotional.prayer,
      devotional_date: devotional.devotional_date,
      available: devotional.available
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (editingDevotional) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Devocionais</h1>
          <Button onClick={() => setShowDialog(true)}>
            <Plus size={20} className="mr-2" />
            Novo Devocional
          </Button>
        </div>

        <div className="grid gap-4">
          {devotionals?.map(devotional => (
            <Card key={devotional.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{devotional.theme}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(devotional.devotional_date), 'dd/MM/yyyy')} - 
                      {devotional.available ? ' Publicado' : ' Rascunho'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(devotional)}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(devotional.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {devotional.book_name} {devotional.chapter}:{devotional.verse_start}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDevotional ? 'Editar Devocional' : 'Novo Devocional'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <Label>Tema</Label>
                <Input
                  value={formData.theme}
                  onChange={(e) => setFormData({...formData, theme: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Livro</Label>
                  <Input
                    value={formData.book_name}
                    onChange={(e) => setFormData({...formData, book_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Capítulo</Label>
                  <Input
                    type="number"
                    value={formData.chapter}
                    onChange={(e) => setFormData({...formData, chapter: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Versículo</Label>
                  <Input
                    type="number"
                    value={formData.verse_start}
                    onChange={(e) => setFormData({...formData, verse_start: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label>Texto do Versículo</Label>
                <Textarea
                  value={formData.verse_text}
                  onChange={(e) => setFormData({...formData, verse_text: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>Introdução</Label>
                <Textarea
                  value={formData.introduction}
                  onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label>Reflexão</Label>
                <Textarea
                  value={formData.reflection}
                  onChange={(e) => setFormData({...formData, reflection: e.target.value})}
                  rows={6}
                />
              </div>

              <div>
                <Label>Pergunta para Refletir</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                />
              </div>

              <div>
                <Label>Aplicações Práticas</Label>
                <Textarea
                  value={formData.practical_applications}
                  onChange={(e) => setFormData({...formData, practical_applications: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label>Oração</Label>
                <Textarea
                  value={formData.prayer}
                  onChange={(e) => setFormData({...formData, prayer: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label>Data do Devocional</Label>
                <Input
                  type="date"
                  value={formData.devotional_date}
                  onChange={(e) => setFormData({...formData, devotional_date: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                />
                <Label>Publicado</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  {editingDevotional ? 'Atualizar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
