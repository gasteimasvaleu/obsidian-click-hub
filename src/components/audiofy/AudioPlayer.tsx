import { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  X,
  Music,
  ChevronDown
} from "lucide-react";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { GlassCard } from "@/components/GlassCard";
import { stripEmoji } from "@/lib/stripEmoji";
import { cn } from "@/lib/utils";
import { AudioEqualizer } from "./AudioEqualizer";
export interface Track {
  id: string;
  title: string;
  description: string;
  file_url: string;
  duration: number | null;
  thumbnail_url: string | null;
}

interface AudioPlayerProps {
  playlist: Track[];
  currentIndex: number;
  onTrackChange: (index: number) => void;
  onClose?: () => void;
  onPlay?: (track: Track) => void;
}

type RepeatMode = 'none' | 'all' | 'one';

export const AudioPlayer = ({ 
  playlist, 
  currentIndex, 
  onTrackChange, 
  onClose,
  onPlay 
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('none');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const currentTrack = playlist[currentIndex];

  // Generate shuffled playlist when shuffle is enabled
  useEffect(() => {
    if (shuffle && playlist.length > 0) {
      const indices = playlist.map((_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  }, [shuffle, playlist.length]);

  // Load new track when currentIndex changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.file_url) {
      audioRef.current.src = currentTrack.file_url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentIndex, currentTrack?.file_url]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        if (onPlay && currentTrack) {
          onPlay(currentTrack);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    // Find next track
    const nextIndex = getNextIndex();
    if (nextIndex !== -1) {
      onTrackChange(nextIndex);
    } else {
      setIsPlaying(false);
    }
  };

  const getNextIndex = (): number => {
    if (shuffle) {
      const currentShufflePos = shuffledIndices.indexOf(currentIndex);
      if (currentShufflePos < shuffledIndices.length - 1) {
        return shuffledIndices[currentShufflePos + 1];
      } else if (repeat === 'all') {
        return shuffledIndices[0];
      }
      return -1;
    }

    if (currentIndex < playlist.length - 1) {
      return currentIndex + 1;
    } else if (repeat === 'all') {
      return 0;
    }
    return -1;
  };

  const getPrevIndex = (): number => {
    if (shuffle) {
      const currentShufflePos = shuffledIndices.indexOf(currentIndex);
      if (currentShufflePos > 0) {
        return shuffledIndices[currentShufflePos - 1];
      } else if (repeat === 'all') {
        return shuffledIndices[shuffledIndices.length - 1];
      }
      return currentIndex;
    }

    if (currentIndex > 0) {
      return currentIndex - 1;
    } else if (repeat === 'all') {
      return playlist.length - 1;
    }
    return currentIndex;
  };

  const handleNext = () => {
    const nextIndex = getNextIndex();
    if (nextIndex !== -1) {
      onTrackChange(nextIndex);
    }
  };

  const handlePrev = () => {
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }
    onTrackChange(getPrevIndex());
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cycleRepeat = () => {
    const modes: RepeatMode[] = ['none', 'all', 'one'];
    const currentIdx = modes.indexOf(repeat);
    setRepeat(modes[(currentIdx + 1) % modes.length]);
  };

  const [expanded, setExpanded] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  useEffect(() => { setExpanded(true); setShowFullDesc(false); }, [currentTrack?.id]);

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const description = stripEmoji(currentTrack.description || "");

  const Cover = ({ className, iconClass }: { className: string; iconClass: string }) =>
    currentTrack.thumbnail_url ? (
      <img src={currentTrack.thumbnail_url} alt="" className={cn("object-cover", className)} />
    ) : (
      <div className={cn("flex items-center justify-center bg-primary/15", className)}>
        <Music className={cn("text-primary", iconClass)} />
      </div>
    );

  const PlayButton = ({ size }: { size: "sm" | "lg" }) => (
    <button
      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
      aria-label={isPlaying ? "Pausar" : "Tocar"}
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95",
        size === "lg" ? "h-14 w-14" : "h-11 w-11"
      )}
    >
      {isPlaying ? <Pause className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} /> : <Play className={cn("ml-0.5", size === "lg" ? "h-7 w-7" : "h-5 w-5")} />}
    </button>
  );

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {!expanded && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4 animate-fade-in">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(true)}
            className="relative mx-auto flex max-w-[58rem] items-center gap-3 overflow-hidden rounded-2xl border border-primary/30 bg-card p-2.5 pr-3 shadow-lg shadow-primary/20"
          >
            <Cover className="h-12 w-12 shrink-0 rounded-xl" iconClass="h-5 w-5" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</p>
            </div>
            <PlayButton size="sm" />
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Próxima"
              className="rounded-full p-2 text-primary hover:bg-primary/10"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            {onClose && (
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                aria-label="Fechar"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted/50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="absolute bottom-0 left-0 h-1 bg-primary transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 z-50 bg-background/30 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setExpanded(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-4 bottom-24 top-[calc(env(safe-area-inset-top)+1rem)] mx-auto flex max-h-fit max-w-lg flex-col overflow-y-auto rounded-3xl border border-primary/40 bg-card p-4 shadow-xl shadow-primary/20 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="mb-2 flex items-center justify-between">
              <button onClick={() => setExpanded(false)} aria-label="Minimizar" className="rounded-full p-2 text-primary hover:bg-primary/10">
                <ChevronDown className="h-7 w-7" />
              </button>
              {onClose && (
                <button onClick={() => { setExpanded(false); onClose(); }} aria-label="Fechar" className="rounded-full p-2 text-muted-foreground hover:bg-muted/50">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-4 flex aspect-[3/1] w-full items-center justify-center rounded-3xl border border-primary/30 bg-primary/5 px-6 py-4">
              <AudioEqualizer isPlaying={isPlaying} size="lg" />
            </div>

            <SectionHeader title={currentTrack.title} className="mb-3" />

            <div className="mb-2">
              <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between px-2">
              <button
                onClick={() => setShuffle(!shuffle)}
                aria-label="Aleatório"
                className={cn("rounded-full p-2.5 transition-colors", shuffle ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button onClick={handlePrev} aria-label="Anterior" className="rounded-full p-2.5 text-primary hover:bg-primary/10">
                <SkipBack className="h-7 w-7" />
              </button>
              <PlayButton size="lg" />
              <button onClick={handleNext} aria-label="Próxima" className="rounded-full p-2.5 text-primary hover:bg-primary/10">
                <SkipForward className="h-7 w-7" />
              </button>
              <button
                onClick={cycleRepeat}
                aria-label="Repetir"
                className={cn("rounded-full p-2.5 transition-colors", repeat !== 'none' ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                {repeat === 'one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
              </button>
            </div>

            <div className="mb-4 hidden items-center justify-center gap-2 sm:flex">
              <button onClick={toggleMute} aria-label="Volume" className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-40" />
            </div>

            {description && (
              <GlassCard>
                <p className={cn("whitespace-pre-line text-sm leading-relaxed text-foreground/80", !showFullDesc && "line-clamp-3")}>
                  {description}
                </p>
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-2 text-sm font-semibold text-primary">
                  {showFullDesc ? "Ver menos" : "Ver mais"}
                </button>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </>
  );
};
