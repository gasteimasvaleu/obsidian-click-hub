import { useState, useEffect } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { RedirectModal } from "@/components/RedirectModal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
// Cache refresh fix

const Index = () => {
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  // Check if user returned from external login
  useEffect(() => {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      // Clear the stored data
      localStorage.removeItem('returnUrl');
      localStorage.removeItem('appState');
    }
  }, []);
  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <GlassCard className="w-full max-w-lg sm:max-w-xl mx-auto text-center">
          <AspectRatio ratio={1} className="w-full mx-auto mb-6">
            <img 
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/image.png"
              alt="Imagem de destaque" 
              className="object-cover rounded-xl w-full h-full"
            />
          </AspectRatio>
          
          <NeonButton onClick={() => setShowRedirectModal(true)}>
            Começar Agora
          </NeonButton>
        </GlassCard>
      </div>
      
      <RedirectModal
        isOpen={showRedirectModal}
        onClose={() => setShowRedirectModal(false)}
        targetUrl="https://bibliatoonkids.themembers.com.br/login"
        title="Biblia Toon Kids"
      />
    </div>
  );
};

export default Index;
