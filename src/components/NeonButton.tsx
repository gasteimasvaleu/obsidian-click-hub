import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const NeonButton = ({ children, onClick, href, className, isLoading, disabled }: NeonButtonProps) => {
  const baseClasses = cn(
    "relative w-full h-12 px-6 rounded-2xl text-base font-semibold",
    "bg-primary text-primary-foreground border-0",
    "shadow-[0_8px_24px_hsl(var(--primary)/0.35)]",
    "transition-all duration-200 ease-out hover:bg-primary/90 active:scale-95",
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
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
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </>
      ) : children}
    </Button>
  );
};