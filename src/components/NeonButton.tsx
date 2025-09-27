import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const NeonButton = ({ children, onClick, href, className }: NeonButtonProps) => {
  const baseClasses = cn(
    "relative px-8 py-4 text-lg font-medium rounded-xl",
    "bg-black/40 text-primary border border-primary",
    "backdrop-filter backdrop-blur-lg",
    "shadow-[0_4px_16px_rgba(0,255,102,0.4)]",
    "transition-all duration-300 ease-out",
    "hover:bg-primary hover:text-black hover:scale-105",
    "hover:shadow-[0_8px_32px_rgba(0,255,102,0.6)]",
    "btn-hover-scale",
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </Button>
  );
};