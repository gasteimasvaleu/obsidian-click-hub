import { Play, Pause, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track } from "./AudioPlayer";

interface SongItemProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onSelect: (index: number) => void;
}

export const SongItem = ({ 
  track, 
  index, 
  isPlaying, 
  isCurrent, 
  onSelect 
}: SongItemProps) => {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    return `${minutes} min`;
  };

  return (
    <button
      onClick={() => onSelect(index)}
      className={cn(
        "w-full glass rounded-xl p-4 text-left transition-all duration-300 group",
        "hover:shadow-[0_0_30px_rgba(0,255,102,0.2)]",
        isCurrent && "ring-2 ring-primary/50 shadow-[0_0_20px_rgba(0,255,102,0.15)]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Play Button / Sound Waves */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
          isCurrent 
            ? "bg-primary text-primary-foreground" 
            : "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          {isCurrent && isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-4 bg-current rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-6 bg-current rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-3 bg-current rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ animationDelay: '300ms' }} />
            </div>
          ) : isCurrent ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold truncate transition-colors",
            isCurrent ? "text-primary" : "text-foreground"
          )}>
            {track.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {track.description}
          </p>
        </div>

        {/* Duration */}
        {track.duration && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(track.duration)}</span>
          </div>
        )}
      </div>
    </button>
  );
};
