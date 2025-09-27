import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const Sobre = () => {
  const handleContactClick = () => {
    console.log("Iniciando contato...");
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <GlassCard className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">Sobre Nós</h1>
          <p className="text-primary/80 mb-8 text-lg">
            Inovação, qualidade e transformação em cada projeto
          </p>
          
          <div className="text-left space-y-6 mb-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Nossa Missão</h3>
              <p className="text-primary/60">
                Criar soluções digitais que transformam experiências e geram resultados excepcionais para nossos clientes.
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Nossa Visão</h3>
              <p className="text-primary/60">
                Ser referência em inovação tecnológica, oferecendo produtos e serviços que superam expectativas.
              </p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-primary font-semibold mb-4">Nossos Valores</h3>
              <ul className="text-primary/60 space-y-2">
                <li>• Excelência em tudo que fazemos</li>
                <li>• Transparência nas relações</li>
                <li>• Inovação constante</li>
                <li>• Foco no resultado do cliente</li>
              </ul>
            </div>
          </div>
          
          <NeonButton onClick={handleContactClick}>
            Entre em Contato
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default Sobre;