import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const NeonButton = ({ children, onClick, className }: NeonButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "relative px-8 py-4 text-lg font-medium rounded-xl",
        "bg-black/40 text-primary border border-primary",
        "backdrop-filter backdrop-blur-lg",
        "shadow-[0_4px_16px_rgba(0,255,102,0.4)]",
        "transition-all duration-300 ease-out",
        "hover:bg-primary hover:text-black hover:scale-105",
        "hover:shadow-[0_8px_32px_rgba(0,255,102,0.6)]",
        "btn-hover-scale",
        className
      )}
    >
      {children}
    </Button>
  );
};