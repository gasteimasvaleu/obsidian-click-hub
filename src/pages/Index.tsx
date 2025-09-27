import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
// Cache refresh fix

const Index = () => {
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
          
          <NeonButton href="https://bibliatoonkids.themembers.com.br/login">
            Começar Agora
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default Index;
