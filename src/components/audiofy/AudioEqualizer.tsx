import { cn } from "@/lib/utils";

interface AudioEqualizerProps {
  isPlaying: boolean;
  className?: string;
  size?: "sm" | "lg";
}

const SMALL = [
  { delay: "0ms", duration: "0.4s" },
  { delay: "100ms", duration: "0.35s" },
  { delay: "50ms", duration: "0.5s" },
  { delay: "150ms", duration: "0.3s" },
  { delay: "75ms", duration: "0.45s" },
  { delay: "125ms", duration: "0.38s" },
  { delay: "25ms", duration: "0.55s" },
];

const LARGE = Array.from({ length: 24 }, (_, i) => ({
  delay: `${(i * 73) % 400}ms`,
  duration: `${0.45 + ((i * 37) % 50) / 100}s`,
}));

export const AudioEqualizer = ({ isPlaying, className, size = "sm" }: AudioEqualizerProps) => {
  if (size === "lg") {
    return (
      <div className={cn("flex h-full w-full items-center justify-between gap-1", className)}>
        {LARGE.map((bar, i) => (
          <div
            key={i}
            className={cn("w-full max-w-2 rounded-full bg-primary", isPlaying ? "equalizer-bar-lg" : "h-[8%]")}
            style={{
              animationDelay: isPlaying ? bar.delay : undefined,
              animationDuration: isPlaying ? bar.duration : undefined,
              boxShadow: isPlaying ? "0 0 10px hsl(var(--primary) / 0.5)" : undefined,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-end justify-center gap-[3px] h-6", className)}>
      {SMALL.map((bar, index) => (
        <div
          key={index}
          className={cn("w-[3px] rounded-full bg-primary transition-all", isPlaying ? "equalizer-bar" : "h-1")}
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
