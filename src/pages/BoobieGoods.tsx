import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { NeonButton } from "@/components/NeonButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Download, RotateCcw, Sparkles, ImageIcon, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const BoobieGoods = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [transformedImage, setTransformedImage] = useState<string>("");
  const [isTransforming, setIsTransforming] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB permitido.");
        return;
      }

      setOriginalFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setOriginalPreview(previewUrl);
      
      // Clear previous transformation
      setTransformedImage("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleTransform = async () => {
    if (!originalFile) {
      toast.error("Selecione uma imagem primeiro");
      return;
    }

    setIsTransforming(true);
    toast.info("Iniciando transformação...");

    try {
      // Função para sanitizar nome do arquivo
      const sanitizeFileName = (fileName: string): string => {
        // Remove extensão
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        
        // Sanitiza o nome:
        // - Remove acentos e caracteres especiais
        // - Substitui espaços por underscores
        // - Mantém apenas letras, números, hífens e underscores
        const sanitized = nameWithoutExt
          .normalize('NFD') // Decompõe caracteres acentuados
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-zA-Z0-9-_]/g, '_') // Substitui caracteres especiais por underscore
          .replace(/_+/g, '_') // Remove underscores duplicados
          .toLowerCase();
        
        return sanitized + extension.toLowerCase();
      };

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedOriginalName = sanitizeFileName(originalFile.name);
      const fileName = `original_${timestamp}_${sanitizedOriginalName}`;

      // Upload original file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photo-transforms')
        .upload(`originals/${fileName}`, originalFile);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // Get public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('photo-transforms')
        .getPublicUrl(`originals/${fileName}`);

      toast.info("Processando com IA...");

      // Call edge function to transform the image
      const { data: transformData, error: transformError } = await supabase.functions
        .invoke('photo-transform', {
          body: {
            imageUrl: publicUrlData.publicUrl,
            fileName: originalFile.name
          }
        });

      if (transformError) {
        throw new Error(`Erro na transformação: ${transformError.message}`);
      }

      if (!transformData.success) {
        throw new Error(transformData.error || 'Falha na transformação');
      }

      setTransformedImage(transformData.transformedImageUrl);
      toast.success("Transformação concluída! 🎨");

    } catch (error) {
      console.error('Transform error:', error);
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsTransforming(false);
    }
  };

  const handleDownload = async () => {
    if (!transformedImage) return;

    try {
      const response = await fetch(transformedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `foto-para-colorir-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      toast.success("Download iniciado! 📥");
    } catch (error) {
      toast.error("Erro no download");
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setTransformedImage("");
    
    // Clean up preview URL
    if (originalPreview) {
      URL.revokeObjectURL(originalPreview);
      setOriginalPreview("");
    }
    
    toast.info("Resetado! Pronto para nova transformação");
  };

  return (
    <div className="min-h-screen bg-black relative">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-16 pb-32">
        {/* Header */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center w-full max-w-3xl">
        {/* Animação */}
        <div className="flex justify-center w-full mb-8 px-4">
          <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/colorir%20novo.mp4"
              className="w-full h-auto"
              style={{ maxHeight: '300px' }}
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
            />
          </GlassCard>
        </div>
            
            <GlassCard className="w-full text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Foto para Colorir AI
              </h1>
              <p className="text-foreground/80 text-lg">
                Transforme suas fotos em desenhos para colorir usando IA avançada
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Upload Section */}
          <div className="glass rounded-2xl p-6 neon-glow-strong">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Upload size={20} />
              Upload da Imagem
            </h2>
            
            {!originalFile ? (
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-primary bg-primary/10 neon-glow' 
                    : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto mb-4 text-primary/60" size={48} />
                <p className="text-muted-foreground mb-2">
                  {isDragActive 
                    ? "Solte a imagem aqui..." 
                    : "Arraste e solte ou clique para selecionar"
                  }
                </p>
                <p className="text-muted-foreground/60 text-sm">
                  PNG, JPG, JPEG, WEBP até 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={originalPreview} 
                    alt="Preview original" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <NeonButton 
                    onClick={isTransforming ? undefined : handleTransform}
                    className={`flex-1 ${isTransforming ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isTransforming ? (
                      <>
                        <Sparkles className="animate-spin mr-2" size={16} />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2" size={16} />
                        Transformar
                      </>
                    )}
                  </NeonButton>
                  <NeonButton 
                    onClick={handleReset}
                    className="bg-black/60 border-primary/60 hover:bg-primary/20"
                  >
                    <RotateCcw size={16} />
                  </NeonButton>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="glass rounded-2xl p-6 neon-glow-strong">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Sparkles size={20} />
              Resultado IA
            </h2>
            
            {!transformedImage ? (
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center h-64 flex items-center justify-center">
                <div>
                  <ImageIcon className="mx-auto mb-4 text-primary/40" size={48} />
                  <p className="text-muted-foreground">
                    {isTransforming 
                      ? "Transformando com IA..." 
                      : "O resultado aparecerá aqui"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={transformedImage} 
                    alt="Imagem transformada" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <NeonButton 
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="mr-2" size={16} />
                  Download do Desenho
                </NeonButton>
              </div>
            )}
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-xl p-4 text-center">
            <Wand2 className="mx-auto mb-3 text-primary" size={24} />
            <h3 className="text-primary font-semibold mb-2">IA Avançada</h3>
            <p className="text-muted-foreground text-sm">
              Processamento inteligente com Runware AI
            </p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <ImageIcon className="mx-auto mb-3 text-primary" size={24} />
            <h3 className="text-primary font-semibold mb-2">Alta Qualidade</h3>
            <p className="text-muted-foreground text-sm">
              Desenhos em 1024x1024px otimizados
            </p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Download className="mx-auto mb-3 text-primary" size={24} />
            <h3 className="text-primary font-semibold mb-2">Download Instantâneo</h3>
            <p className="text-muted-foreground text-sm">
              Baixe seus desenhos em segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoobieGoods;