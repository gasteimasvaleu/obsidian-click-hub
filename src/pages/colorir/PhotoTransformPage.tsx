import { useNavigate } from 'react-router-dom';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { GlassCard } from '@/components/GlassCard';
import { PhotoUploader } from '@/components/colorir/PhotoUploader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera } from 'lucide-react';

const PhotoTransformPage = () => {
  const navigate = useNavigate();

  const handleTransformed = (transformedUrl: string, _originalUrl: string) => {
    navigate(`/colorir/editor/photo?photoUrl=${encodeURIComponent(transformedUrl)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />

      <main className="container mx-auto px-4 pt-16 max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/colorir')}
          className="mb-4"
        >
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <GlassCard className="text-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 w-fit mx-auto mb-4">
            <Camera size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">Transformar Foto</h1>
          <p className="text-muted-foreground text-sm">
            A inteligência artificial vai transformar sua foto em um desenho para colorir! ✨
          </p>
        </GlassCard>

        <PhotoUploader onTransformed={handleTransformed} />
      </main>
    </div>
  );
};

export default PhotoTransformPage;
