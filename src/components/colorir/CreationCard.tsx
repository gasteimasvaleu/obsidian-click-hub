import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Share2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CreationCardProps {
  id: string;
  title: string;
  coloredImageUrl: string;
  isFromPhoto: boolean;
  createdAt: string;
  onShare: (imageUrl: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const CreationCard = ({
  id,
  title,
  coloredImageUrl,
  isFromPhoto,
  createdAt,
  onShare,
  onDelete,
}: CreationCardProps) => {
  return (
    <GlassCard className="overflow-hidden group">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white/5 mb-3">
        <img
          src={coloredImageUrl}
          alt={title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {isFromPhoto && (
          <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
            📸 Foto
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        {format(new Date(createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onShare(coloredImageUrl, title)}
        >
          <Share2 size={14} />
          Compartilhar
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive shrink-0 h-8 w-8"
          onClick={() => onDelete(id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </GlassCard>
  );
};
