import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const Index = () => {
  const handleStartClick = () => {
    // Add your conversion logic here
    console.log("Starting conversion flow...");
  };

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
          
          <NeonButton onClick={handleStartClick}>
            Começar Agora
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default Index;
