import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const COUNT = 7;

type ArrowNavButtonProps = {
  direction?: "left" | "right";
  label: string;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function ArrowNavButton({ direction = "left", label, to, onClick, disabled, className }: ArrowNavButtonProps) {
  const left = direction === "left";
  const Icon = left ? ChevronLeft : ChevronRight;
  const cls = cn(
    "neon-glow-user feature-bubble bubble-user relative flex w-full h-12 items-center justify-center overflow-hidden rounded-2xl",
    disabled && "opacity-50 pointer-events-none",
    className
  );
  const inner = (
    <>
      <span aria-hidden className="border-beam" />
      <span aria-hidden className="relative z-[2] flex items-center -space-x-1">
        {Array.from({ length: COUNT }).map((_, i) => {
          // left: faint on the left, strong on the right; right: strong on the right too (fading behind)
          const strength = left ? i : i;
          return (
            <Icon
              key={i}
              className={cn(left ? "back-arrow" : "next-arrow", "h-5 w-5 text-primary-foreground")}
              strokeWidth={3}
              style={{
                ["--arrow-opacity" as string]: left
                  ? 0.15 + (0.85 * strength) / (COUNT - 1)
                  : 0.15 + (0.85 * strength) / (COUNT - 1),
                animationDelay: left ? `${(COUNT - 1 - i) * 0.12}s` : `${i * 0.12}s`,
              }}
            />
          );
        })}
      </span>
    </>
  );
  if (to && !disabled) {
    return <Link to={to} aria-label={label} title={label} className={cls}>{inner}</Link>;
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={cls}>
      {inner}
    </button>
  );
}

export function BackArrowButton({ to, label, className }: { to: string; label: string; className?: string }) {
  return <ArrowNavButton direction="left" to={to} label={label} className={className} />;
}
