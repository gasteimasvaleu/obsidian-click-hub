import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

interface DrawingCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  difficulty: string;
  onSelect: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  facil: 'bg-primary/20 text-primary border-primary/40',
  medio: 'bg-blue-500/20 text-blue-400 border-blue-400/40',
  avancado: 'bg-red-500/20 text-red-400 border-red-400/40',
};

const difficultyLabels: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  avancado: 'Avançado',
};

export const DrawingCard = ({ id, title, description, imageUrl, difficulty, onSelect }: DrawingCardProps) => {
  return (
    <GlassCard hoverable pressable className="group overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-white/5">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
          <Badge
            variant="outline"
            className={`absolute top-2 right-2 ${difficultyColors[difficulty] || difficultyColors.facil} border text-xs`}
          >
            {difficultyLabels[difficulty] || difficulty}
          </Badge>
        </div>
        <h3 className="text-base font-bold text-foreground mb-1 line-clamp-1">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}
        <Button
          size="sm"
          className="w-full mt-auto transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 active:scale-95"
          onClick={() => onSelect(id)}
        >
          <Paintbrush size={16} />
          Colorir
        </Button>
      </div>
    </GlassCard>
  );
};
