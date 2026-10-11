import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useThemePreferences } from "@/contexts/ThemePreferencesContext";

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
        "glass rounded-2xl p-6",
        glowClass,
        hoverable && `transition-all duration-300 hover:scale-105 ${hoverShadow} cursor-pointer`,
        pressable && "active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
};
