import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploaderProps {
  onTransformed: (transformedUrl: string, originalUrl: string) => void;
}

export const PhotoUploader = ({ onTransformed }: PhotoUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, envie uma imagem');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      // Upload original to storage first
      const fileName = `originals/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('photo-transforms')
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('photo-transforms')
        .getPublicUrl(fileName);

      // Call the transform function
      const { data, error } = await supabase.functions.invoke('photo-transform', {
        body: { imageUrl: urlData.publicUrl, fileName: file.name },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Erro na transformação');

      toast.success('Foto transformada com sucesso! 🎨');
      onTransformed(data.transformedImageUrl, urlData.publicUrl);
    } catch (err: any) {
      console.error('Photo transform error:', err);
      toast.error(err.message || 'Erro ao transformar foto');
    } finally {
      setLoading(false);
    }
  }, [onTransformed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && processFile(files[0]),
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <GlassCard className="text-center">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${loading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-foreground font-medium">Transformando sua foto em desenho...</p>
            <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
            <p className="text-muted-foreground text-sm">Clique ou arraste para trocar a foto</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500">
              <Camera size={32} className="text-white" />
            </div>
            <p className="text-foreground font-medium">Envie uma foto para transformar em desenho</p>
            <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP • Máximo 10MB</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Upload size={16} />
              Escolher Foto
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
