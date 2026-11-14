import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { useNavigate } from 'react-router-dom';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { GlassCard } from '@/components/GlassCard';
import { PhotoUploader } from '@/components/colorir/PhotoUploader';
import { SectionHeader } from '@/components/plataforma/CourseCarousel';
import fotoImg from '@/assets/colorir/transformar-foto.png.asset.json';
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

      <main className="container mx-auto px-4 pt-16 max-w-[58rem]">
        <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate('/colorir')} className="mb-4" />

        <div className="mb-6">
          <SectionHeader title="Transformar Foto" className="mb-0" />
          <GlassCard className="-mt-4 rounded-t-none pt-7 text-center">
            <img src={fotoImg.url} alt="Câmera com uma foto se transformando em desenho" className="mx-auto mb-3 h-24 w-24 object-contain" />
            <p className="text-muted-foreground text-sm">
              A inteligência artificial vai transformar sua foto em um desenho para colorir!
            </p>
          </GlassCard>
          </div>

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
