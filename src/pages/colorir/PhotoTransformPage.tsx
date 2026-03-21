import { useNavigate } from 'react-router-dom';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { GlassCard } from '@/components/GlassCard';
import { PhotoUploader } from '@/components/colorir/PhotoUploader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAIConsent } from '@/hooks/useAIConsent';
import { AIConsentDialog } from '@/components/AIConsentDialog';
import { useState } from 'react';

const PhotoTransformPage = () => {
  const navigate = useNavigate();
  const { showConsent, setShowConsent, acceptConsent, hasConsent } = useAIConsent();
  const [consentChecked, setConsentChecked] = useState(false);

  // Show consent on first interaction if not yet accepted
  const handlePageInteraction = () => {
    if (!consentChecked && !hasConsent()) {
      setShowConsent(true);
      setConsentChecked(true);
      return false;
    }
    return true;
  };

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
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Transformar Foto</h1>
          <p className="text-muted-foreground text-sm">
            A inteligência artificial vai transformar sua foto em um desenho para colorir! ✨
          </p>
        </GlassCard>

        <div onClick={handlePageInteraction}>
          <PhotoUploader onTransformed={handleTransformed} />
        </div>
      </main>

      <AIConsentDialog
        open={showConsent}
        onAccept={() => {
          acceptConsent();
          setShowConsent(false);
        }}
        onCancel={() => setShowConsent(false)}
      />
    </div>
  );
};

export default PhotoTransformPage;
