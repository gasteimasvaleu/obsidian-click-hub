import { useEffect, useState, useRef } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { EbookItemSkeleton } from "@/components/skeletons/EbookItemSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Music, Download, Clock, BookOpen, Video, Play, Pause, Volume2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

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
  content_type: string;
  video_url: string | null;
}

const Ebooks = () => {
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

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

  const handleDownloadClick = async (ebook: Ebook) => {
    if (!ebook.file_url) {
      toast.error("Arquivo não disponível");
      return;
    }

    window.open(ebook.file_url, "_blank");
    toast.success(`Download iniciado: ${ebook.title}`);
    
    if (user) {
      const pointsEarned = 20;
      await addActivity(
        'music_listened',
        ebook.id,
        ebook.title,
        pointsEarned
      );
    }
  };

  const handlePlayAudio = async (ebook: Ebook) => {
    if (!ebook.file_url) {
      toast.error("Áudio não disponível");
      return;
    }

    const audio = audioRefs.current[ebook.id];
    if (!audio) return;

    if (playingAudio === ebook.id) {
      audio.pause();
      setPlayingAudio(null);
    } else {
      // Pausar qualquer áudio tocando
      Object.values(audioRefs.current).forEach(a => a?.pause());
      await audio.play();
      setPlayingAudio(ebook.id);
      
      if (user) {
        await addActivity('music_listened', ebook.id, ebook.title, 20);
      }
    }
  };

  const isAudioBook = (ebook: Ebook) => {
    return ebook.content_type === 'audiobook';
  };

  const isVideo = (ebook: Ebook) => {
    return ebook.content_type === 'video';
  };

  const isEbook = (ebook: Ebook) => {
    return ebook.content_type === 'ebook' || (!ebook.content_type && !isAudioBook(ebook) && !isVideo(ebook));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  };

  const isExternalVideo = (ebook: Ebook) => {
    return ebook.video_url && (
      ebook.video_url.includes('youtube') || 
      ebook.video_url.includes('youtu.be') || 
      ebook.video_url.includes('vimeo')
    );
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    }
    if (url.includes('vimeo')) {
      return getVimeoEmbedUrl(url);
    }
    return url;
  };

  const getContentIcon = (ebook: Ebook) => {
    if (isVideo(ebook)) return <Video className="w-3 h-3" />;
    if (isAudioBook(ebook)) return <Music className="w-3 h-3" />;
    return <FileText className="w-3 h-3" />;
  };

  const getContentLabel = (ebook: Ebook) => {
    if (isVideo(ebook)) return "VÍDEO";
    if (isAudioBook(ebook)) return "ÁUDIO";
    return "PDF";
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex flex-col items-center w-full">
          {/* Video animation */}
          <div className="flex justify-center w-full mb-8">
            <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
              <video
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/ebooksnovo.mp4"
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
          
          <GlassCard className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Audiofy
            </h1>
            <p className="text-foreground/80 mb-8 text-lg">
              Músicas cristãs para crianças
            </p>
          
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EbookItemSkeleton key={i} />
                ))}
              </div>
            ) : ebooks.length === 0 ? (
              <EmptyState
                icon={<Music size={40} strokeWidth={1.5} />}
                title="Músicas em construção"
                description="Estamos preparando uma coleção especial de músicas cristãs para você! 🎵"
                className="my-8"
              />
            ) : (
              <div className="space-y-4 mb-8">
                {ebooks.map((ebook) => (
                  <div 
                    key={ebook.id} 
                    className="glass rounded-xl p-6 text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-primary font-semibold flex-1">{ebook.title}</h3>
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/20 text-primary ml-2">
                        {getContentIcon(ebook)}
                        <span>{getContentLabel(ebook)}</span>
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {ebook.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-muted-foreground/60 text-xs mb-4">
                      <span>{ebook.format}</span>
                      {ebook.pages && isEbook(ebook) && (
                        <span>• {ebook.pages} páginas</span>
                      )}
                      {ebook.duration && (isAudioBook(ebook) || isVideo(ebook)) && (
                        <span className="flex items-center gap-1">
                          • <Clock className="w-3 h-3" /> {ebook.duration} min
                        </span>
                      )}
                    </div>
                    
                    {/* Inline Audio Player */}
                    {isAudioBook(ebook) && ebook.file_url && (
                      <div className="mt-4">
                        <audio
                          ref={(el) => { audioRefs.current[ebook.id] = el; }}
                          src={ebook.file_url}
                          preload="metadata"
                          onEnded={() => setPlayingAudio(null)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <button
                            onClick={() => handlePlayAudio(ebook)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            {playingAudio === ebook.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-primary">
                              {playingAudio === ebook.id ? "Reproduzindo..." : "Clique para ouvir"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Volume2 className="w-3 h-3" />
                              <span>Audiobook</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inline Video Player */}
                    {isVideo(ebook) && (
                      <div className="mt-4">
                        {isExternalVideo(ebook) && ebook.video_url ? (
                          <div className="aspect-video rounded-lg overflow-hidden border border-primary/20">
                            <iframe
                              src={getEmbedUrl(ebook.video_url)}
                              className="w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : ebook.file_url ? (
                          <video
                            controls
                            className="w-full rounded-lg border border-primary/20"
                            preload="metadata"
                          >
                            <source src={ebook.file_url} type="video/mp4" />
                            Seu navegador não suporta o player de vídeo.
                          </video>
                        ) : null}
                      </div>
                    )}

                    {/* Download Button for PDFs */}
                    {isEbook(ebook) && (
                      <button
                        onClick={() => handleDownloadClick(ebook)}
                        className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 hover:gap-3 active:scale-95"
                      >
                        <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
                        Baixar Agora
                      </button>
                    )}
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
