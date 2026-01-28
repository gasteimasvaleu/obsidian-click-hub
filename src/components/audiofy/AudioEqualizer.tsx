import { cn } from "@/lib/utils";

interface AudioEqualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioEqualizer = ({ isPlaying, className }: AudioEqualizerProps) => {
  const bars = [
    { delay: "0ms", duration: "0.4s" },
    { delay: "100ms", duration: "0.35s" },
    { delay: "50ms", duration: "0.5s" },
    { delay: "150ms", duration: "0.3s" },
    { delay: "75ms", duration: "0.45s" },
    { delay: "125ms", duration: "0.38s" },
    { delay: "25ms", duration: "0.55s" },
  ];

  return (
    <div 
      className={cn(
        "flex items-end justify-center gap-[3px] h-6",
        className
      )}
    >
      {bars.map((bar, index) => (
        <div
          key={index}
          className={cn(
            "w-[3px] rounded-full bg-primary transition-all",
            isPlaying ? "equalizer-bar" : "h-1"
          )}
          style={{
            animationDelay: isPlaying ? bar.delay : undefined,
            animationDuration: isPlaying ? bar.duration : undefined,
            boxShadow: isPlaying ? "0 0 8px hsl(var(--primary) / 0.6)" : undefined,
          }}
        />
      ))}
    </div>
  );
};
