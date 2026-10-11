import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  pressable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard = ({ 
  children, 
  className, 
  hoverable = false,
  pressable = false,
  onClick,
  style 
}: GlassCardProps) => {
  const glowClass = 'neon-glow-user';
  const hoverShadow = 'hover:shadow-[0_0_40px_var(--user-glow-hover)]';

  return (
    <div 
      onClick={onClick}
      style={style}
      className={cn(
        "glass relative rounded-2xl p-6",
        glowClass,
        hoverable && `transition-all duration-300 hover:scale-105 ${hoverShadow} cursor-pointer`,
        pressable && "active:scale-[0.98]",
        className
      )}
    >
      <span aria-hidden className="border-beam" />
      {children}
    </div>
  );
};
