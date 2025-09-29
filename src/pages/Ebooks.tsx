import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const Ebooks = () => {
  const handleDownloadClick = () => {
    console.log("Iniciando download de ebook...");
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex flex-col items-center w-full">
          {/* Video animation */}
          <div className="flex justify-center mb-8">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/jesusebooks.mp4"
              width="500"
              height="500"
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
              className="rounded-lg"
            />
          </div>
          
          <GlassCard className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Ebooks Digitais</h1>
          <p className="text-foreground/80 mb-8 text-lg">
            Biblioteca digital com conteúdo exclusivo e transformador
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="glass rounded-xl p-6 text-left">
              <h3 className="text-primary font-semibold mb-2">Guia Completo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Manual abrangente com estratégias práticas
              </p>
              <span className="text-muted-foreground/60 text-xs">PDF • 120 páginas</span>
            </div>
            
            <div className="glass rounded-xl p-6 text-left">
              <h3 className="text-primary font-semibold mb-2">Masterclass Digital</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Conteúdo premium para resultados excepcionais
              </p>
              <span className="text-muted-foreground/60 text-xs">PDF + Vídeos • 80 páginas</span>
            </div>
          </div>
          
          <NeonButton onClick={handleDownloadClick}>
            Baixar Agora
          </NeonButton>
        </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Ebooks;