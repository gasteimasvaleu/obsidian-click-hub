import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useEffect, useState, useRef } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { EbookItemSkeleton } from "@/components/skeletons/EbookItemSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { Music } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";
import { AudioPlayer, type Track } from "@/components/audiofy/AudioPlayer";
import { SongItem } from "@/components/audiofy/SongItem";
import audiofyTopo from "@/assets/audiofy/bibliafy-topo.mp4.asset.json";

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

const Audiofy = () => {
  const { user } = useAuth();
  const { addActivity } = useUserProgress();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Player state
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Track which songs have been registered for gamification in this session
  const registeredSongsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    const { data, error } = await supabase
      .from("ebooks")
      .select("*")
      .eq("available", true)
      .eq("content_type", "audiobook")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar músicas:", error);
      toast.error("Erro ao carregar músicas");
    } else {
      setEbooks(data || []);
    }
    setLoading(false);
  };

  // Convert ebooks to tracks format
  const audioTracks: Track[] = ebooks
    .filter(e => e.file_url)
    .map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      file_url: e.file_url!,
      duration: e.duration,
      thumbnail_url: e.thumbnail_url,
    }));

  const handleSelectTrack = (index: number) => {
    setPlaylist(audioTracks);
    setCurrentIndex(index);
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const handleTrackChange = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlay = async (track: Track) => {
    // Register activity only once per session per track
    if (user && !registeredSongsRef.current.has(track.id)) {
      registeredSongsRef.current.add(track.id);
      await addActivity('music_listened', track.id, track.title, 20);
    }
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setIsPlaying(false);
  };

  const currentTrack = playlist[currentIndex];

  return (
    <div className={`min-h-screen bg-background relative ${showPlayer ? 'pb-56' : 'pb-24'}`}>
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex flex-col items-center w-full">
          {/* Top illustration */}
          <div className="flex justify-center w-full mb-8">
            <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
              <video
                src={audiofyTopo.url}
                className="aspect-video w-full h-auto object-cover"
                autoPlay
                muted
                playsInline
              />
            </GlassCard>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <SectionHeader title="Bíbliafy" description="Músicas cristãs para crianças" className="mb-6" />
          </div>
          <GlassCard className="max-w-4xl mx-auto text-center w-full">
          
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EbookItemSkeleton key={i} />
                ))}
              </div>
            ) : audioTracks.length === 0 ? (
              <EmptyState
                icon={<Music size={40} strokeWidth={1.5} />}
                title="Músicas em construção"
                description="Estamos preparando uma coleção especial de músicas cristãs para você!"
                className="my-8"
              />
            ) : (
              <div className="space-y-3 mb-8">
                {audioTracks.map((track, index) => (
                  <SongItem
                    key={track.id}
                    track={track}
                    index={index}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    isCurrent={currentTrack?.id === track.id}
                    onSelect={handleSelectTrack}
                  />
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Persistent Audio Player */}
      {showPlayer && playlist.length > 0 && (
        <AudioPlayer
          playlist={playlist}
          currentIndex={currentIndex}
          onTrackChange={handleTrackChange}
          onClose={handleClosePlayer}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
};

export default Audiofy;
