import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn(
      "glass rounded-2xl p-6 neon-glow-strong animate-float",
      className
    )}>
      {children}
    </div>
  );
};