import { useNavigate } from "react-router-dom";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const AmigoDivino = () => {
  const navigate = useNavigate();
  
  const handleConnectClick = () => {
    navigate('/amigodivino/chat');
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex flex-col items-center w-full">
          {/* Animação */}
          <div className="flex justify-center w-full mb-8">
            <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
              <video
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/jesuslegal.mp4"
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
          
          <GlassCard className="w-full max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Amigo Divino</h1>
          <p className="text-foreground/80 mb-8 text-lg">
            Conexão espiritual e orientação para sua jornada
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Orientação Espiritual</h3>
              <p className="text-muted-foreground text-sm">
                Converse com seu companheiro espiritual, tire dúvidas sobre a Bíblia, receba palavras de encorajamento e descubra mais sobre a Palavra de Deus de um jeito divertido e acolhedor.
              </p>
            </div>
          </div>
          
          <NeonButton onClick={handleConnectClick}>
            Começar Jornada
          </NeonButton>
        </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AmigoDivino;