import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const AmigoDivino = () => {
  const handleConnectClick = () => {
    console.log("Conectando com Amigo Divino...");
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <GlassCard className="max-w-2xl mx-auto text-center">
          {/* Animação */}
          <div className="flex justify-center mb-8">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/amigodivino.mp4"
              className="max-w-full h-auto rounded-xl"
              style={{ maxWidth: '500px', maxHeight: '500px' }}
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
            />
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-6">Amigo Divino</h1>
          <p className="text-primary/80 mb-8 text-lg">
            Conexão espiritual e orientação para sua jornada
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Orientação Espiritual</h3>
              <p className="text-primary/60 text-sm">
                Encontre paz, propósito e direcionamento em sua caminhada
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Comunidade</h3>
              <p className="text-primary/60 text-sm">
                Conecte-se com outras pessoas em busca de crescimento espiritual
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Recursos</h3>
              <p className="text-primary/60 text-sm">
                Meditações, orações e conteúdo inspiracional diário
              </p>
            </div>
          </div>
          
          <NeonButton onClick={handleConnectClick}>
            Começar Jornada
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default AmigoDivino;