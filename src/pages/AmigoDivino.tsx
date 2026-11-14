import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useState } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { ChatInterface } from "@/components/ChatInterface";

const AmigoDivino = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative pb-24">
      <FuturisticNavbar />
      
      <div className="pt-16 px-4">
        <div className="flex flex-col items-center w-full">
          {/* Animação */}
          <div className="flex justify-center w-full mb-8">
            <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
              <video
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/jesuslegal.mp4"
                className="aspect-video w-full h-auto object-cover"
                autoPlay
                muted
                playsInline
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                }}
              />
            </GlassCard>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <SectionHeader title="Amigo Divino" description="Conexão espiritual e orientação para sua jornada" className="mb-6" />
          </div>
          <GlassCard className="w-full max-w-4xl mx-auto text-center">
            
            <div className="space-y-6 mb-8">
              <div className="glass rounded-xl p-6">
                <h3 className="text-primary font-semibold mb-4">Orientação Espiritual</h3>
                <p className="text-muted-foreground text-sm">
                  Converse com seu companheiro espiritual, tire dúvidas sobre a Bíblia, receba palavras de encorajamento e descubra mais sobre a Palavra de Deus de um jeito divertido e acolhedor.
                </p>
              </div>
            </div>
            
            <NeonButton onClick={() => setIsChatOpen(true)}>
              Começar Jornada
            </NeonButton>
          </GlassCard>
        </div>
      </div>

      <ChatInterface open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default AmigoDivino;
