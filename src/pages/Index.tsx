import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const handleStartClick = () => {
    // Add your conversion logic here
    console.log("Starting conversion flow...");
  };

  return (
    <div className="min-h-screen bg-black relative">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <GlassCard className="max-w-md mx-auto text-center">
          <img 
            src={heroImage}
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
