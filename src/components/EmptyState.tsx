import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn("col-span-full", className)}>
      <GlassCard className="text-center py-12 px-6 max-w-md mx-auto">
        <div className="space-y-4 animate-fade-in">
          {/* Ícone ilustrado */}
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20 animate-float">
            <div className="text-primary/70">
              {icon}
            </div>
          </div>
          
          {/* Conteúdo textual */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Botão de ação (opcional) */}
          {action && (
            <Button 
              onClick={action.onClick}
              variant="outline"
              className="mt-6 transition-all duration-300 hover:border-primary/50 hover:text-primary active:scale-95"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
