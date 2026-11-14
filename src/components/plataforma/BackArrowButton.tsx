import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const COUNT = 7;

export function BackArrowButton({ to, label, className }: { to: string; label: string; className?: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "neon-glow-user feature-bubble bubble-user relative flex w-full h-12 items-center justify-center overflow-hidden rounded-2xl",
        className
      )}
    >
      <span aria-hidden className="border-beam" />
      <span aria-hidden className="relative z-[2] flex items-center -space-x-1">
        {Array.from({ length: COUNT }).map((_, i) => (
          <ChevronLeft
            key={i}
            className="back-arrow h-5 w-5 text-primary-foreground"
            strokeWidth={3}
            style={{
              ["--arrow-opacity" as string]: 0.15 + (0.85 * i) / (COUNT - 1),
              animationDelay: `${(COUNT - 1 - i) * 0.12}s`,
            }}
          />
        ))}
      </span>
    </Link>
  );
}
