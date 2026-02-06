import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useColoringCanvas } from '@/hooks/useColoringCanvas';
import { ColoringCanvas } from '@/components/colorir/ColoringCanvas';
import { ColorPalette } from '@/components/colorir/ColorPalette';
import { ToolBar } from '@/components/colorir/ToolBar';
import { BrushSizeSlider } from '@/components/colorir/BrushSizeSlider';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserProgress } from '@/hooks/useUserProgress';
import { fireCompleteConfetti } from '@/lib/confetti';

const ColoringEditorPage = () => {
  const { drawingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const canvas = useColoringCanvas();
  const [saving, setSaving] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('Minha Criação');
  const [imageUrl, setImageUrl] = useState('');
  const [isFromPhoto, setIsFromPhoto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const photoUrl = searchParams.get('photoUrl');
    if (photoUrl) {
      setImageUrl(decodeURIComponent(photoUrl));
      setIsFromPhoto(true);
      setDrawingTitle('Foto Transformada');
      setLoading(false);
    } else if (drawingId) {
      loadDrawing(drawingId);
    }
  }, [drawingId, searchParams]);

  const loadDrawing = async (id: string) => {
    const { data, error } = await supabase
      .from('coloring_drawings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Desenho não encontrado');
      navigate('/colorir');
      return;
    }

    setImageUrl(data.image_url);
    setDrawingTitle(data.title);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Faça login para salvar');
      return;
    }

    setSaving(true);
    try {
      const blob = await canvas.getCanvasBlob();
      if (!blob) throw new Error('Erro ao capturar canvas');

      const fileName = `creations/${user.id}/${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('coloring')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('coloring')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('user_coloring_creations')
        .insert({
          user_id: user.id,
          drawing_id: isFromPhoto ? null : drawingId || null,
          original_image_url: imageUrl,
          colored_image_url: urlData.publicUrl,
          title: drawingTitle,
          is_from_photo: isFromPhoto,
        });

      if (insertError) throw insertError;

      // Gamification
      const points = isFromPhoto ? 20 : 15;
      await addActivity('coloring_completed', drawingId || null, drawingTitle, points);
      
      fireCompleteConfetti();
      toast.success(`Criação salva! +${points} pontos 🎨`);
      navigate('/colorir/minhas-criacoes');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Erro ao salvar criação');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Voltar
        </Button>
        <h1 className="text-sm font-semibold text-foreground truncate max-w-[40%]">
          {drawingTitle}
        </h1>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-3 overflow-hidden flex items-center justify-center">
        <ColoringCanvas canvas={canvas} imageUrl={imageUrl} />
      </div>

      {/* Controls */}
      <div className="p-3 pb-28 space-y-3 border-t border-border bg-background/80 backdrop-blur">
        <BrushSizeSlider size={canvas.brushSize} onChange={canvas.setBrushSize} />
        <ToolBar
          tool={canvas.tool}
          onToolChange={canvas.setTool}
          onUndo={canvas.undo}
          onRedo={canvas.redo}
          canUndo={canvas.canUndo}
          canRedo={canvas.canRedo}
        />
        <ColorPalette selectedColor={canvas.color} onColorChange={canvas.setColor} />
      </div>
    </div>
  );
};

export default ColoringEditorPage;
