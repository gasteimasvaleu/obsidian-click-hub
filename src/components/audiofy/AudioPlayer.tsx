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
  Music
} from "lucide-react";
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

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4 animate-fade-in">
      <div className="max-w-2xl mx-auto glass rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,102,0.15)] border border-primary/20">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Track Info & Close */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground leading-tight">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {currentTrack.description}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Equalizer Visualizer */}
          <div className="flex items-center justify-between">
            <AudioEqualizer isPlaying={isPlaying} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={cn(
                "p-2 rounded-full transition-colors",
                shuffle 
                  ? "text-primary bg-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full text-foreground hover:bg-muted/50 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full text-foreground hover:bg-muted/50 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={cycleRepeat}
              className={cn(
                "p-2 rounded-full transition-colors",
                repeat !== 'none'
                  ? "text-primary bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Volume Control - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 mt-4 pt-3 border-t border-primary/10">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};
