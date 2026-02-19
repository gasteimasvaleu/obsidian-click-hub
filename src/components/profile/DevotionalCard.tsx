import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface DevotionalCardProps {
  devotional: {
    theme: string;
    book_name: string;
    chapter: number;
    verse_start: number;
    verse_end?: number | null;
    verse_text: string;
  };
  userNotes?: string | null;
  completedAt: string;
  onClick: () => void;
}

export const DevotionalCard = ({ devotional, userNotes, completedAt, onClick }: DevotionalCardProps) => {
  const formattedDate = format(parseISO(completedAt), "d 'de' MMM", { locale: ptBR });
  
  return (
    <div 
      onClick={onClick}
      className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">✨ {devotional.theme}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            📖 {devotional.book_name} {devotional.chapter}:{devotional.verse_start}
            {devotional.verse_end && devotional.verse_end !== devotional.verse_start ? `-${devotional.verse_end}` : ''}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            "{devotional.verse_text}"
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {userNotes && (
            <Badge variant="outline" className="text-xs border-primary/50">
              📝 Anotações
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
