import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useThemePreferences } from "@/contexts/ThemePreferencesContext";

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
  const { glowColor } = useThemePreferences();
  
  const glowClass = glowColor === 'green' ? 'neon-glow-strong-green' : 'neon-glow-strong-purple';
  const hoverShadow = glowColor === 'green' 
    ? 'hover:shadow-[0_0_40px_rgba(0,255,102,0.3)]' 
    : 'hover:shadow-[0_0_40px_rgba(180,50,255,0.3)]';

  return (
    <div 
      onClick={onClick}
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
