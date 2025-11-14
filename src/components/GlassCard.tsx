import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  pressable?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ 
  children, 
  className, 
  hoverable = false,
  pressable = false,
  onClick 
}: GlassCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-6 neon-glow-strong",
        hoverable && "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,102,0.3)] cursor-pointer",
        pressable && "active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
};