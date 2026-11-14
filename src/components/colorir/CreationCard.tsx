import { GlassCard } from '@/components/GlassCard';
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
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3">
        <img
          src={coloredImageUrl}
          alt={title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {isFromPhoto && (
          <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">Foto
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        {format(new Date(createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
      </p>
      <div className="flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border">
        <button
          type="button"
          aria-label="Compartilhar"
          className="flex h-11 flex-1 items-center justify-center text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          onClick={() => onShare(coloredImageUrl, title)}
        >
          <Share2 size={18} />
        </button>
        <button
          type="button"
          aria-label="Excluir"
          className="flex h-11 flex-1 items-center justify-center text-destructive transition-colors hover:bg-destructive/10"
          onClick={() => onDelete(id)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </GlassCard>
  );
};
