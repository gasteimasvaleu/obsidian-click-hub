import { useState, useEffect } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { RedirectModal } from "@/components/RedirectModal";
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
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <GlassCard className="max-w-md mx-auto text-center">
          <img 
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/image.png"
            alt="Imagem de destaque" 
            className="w-full h-48 object-cover rounded-xl mb-6"
          />
          
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
