import { useEffect, useState } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { EbookItemSkeleton } from "@/components/skeletons/EbookItemSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Music, Download, Clock } from "lucide-react";
import { toast } from "sonner";

interface Ebook {
  id: string;
  title: string;
  description: string;
  pages: number | null;
  format: string;
  file_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  available: boolean;
}

const Ebooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    const { data, error } = await supabase
      .from("ebooks")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar ebooks:", error);
      toast.error("Erro ao carregar conteúdo");
    } else {
      setEbooks(data || []);
    }
    setLoading(false);
  };

  const handleDownloadClick = (ebook: Ebook) => {
    if (!ebook.file_url) {
      toast.error("Arquivo não disponível");
      return;
    }

    // Open file URL in new tab
    window.open(ebook.file_url, "_blank");
    toast.success(`Download iniciado: ${ebook.title}`);
  };

  const isAudioBook = (format: string) => {
    return format.toLowerCase().includes("mp3") || 
           format.toLowerCase().includes("m4a") || 
           format.toLowerCase().includes("audio");
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
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Ebooks & Audio Books
            </h1>
            <p className="text-foreground/80 mb-8 text-lg">
              Biblioteca digital com ebooks e audiobooks exclusivos
            </p>
          
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EbookItemSkeleton key={i} />
                ))}
              </div>
            ) : ebooks.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                Nenhum conteúdo disponível no momento
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {ebooks.map((ebook) => (
                  <div 
                    key={ebook.id} 
                    className="glass rounded-xl p-6 text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:scale-[1.02] active:scale-[0.99] group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-primary font-semibold flex-1">{ebook.title}</h3>
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/20 text-primary ml-2">
                        {isAudioBook(ebook.format) ? (
                          <>
                            <Music className="w-3 h-3" />
                            <span>AUDIO</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </>
                        )}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {ebook.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-muted-foreground/60 text-xs">
                      <span>{ebook.format}</span>
                      {ebook.pages && !isAudioBook(ebook.format) && (
                        <span>• {ebook.pages} páginas</span>
                      )}
                      {ebook.duration && isAudioBook(ebook.format) && (
                        <span className="flex items-center gap-1">
                          • <Clock className="w-3 h-3" /> {ebook.duration} min
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDownloadClick(ebook)}
                      className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 hover:gap-3 active:scale-95"
                    >
                      <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
                      {isAudioBook(ebook.format) ? "Ouvir Agora" : "Baixar Agora"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Ebooks;
