import { stripEmoji } from "@/lib/stripEmoji";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DevotionalDetailModalProps {
  devotional: {
    id: string;
    user_notes: string | null;
    completed_at: string;
    devotional: {
      theme: string;
      book_name: string;
      chapter: number;
      verse_start: number;
      verse_end?: number | null;
      verse_text: string;
      introduction: string;
      reflection: string;
      question: string;
      practical_applications: string;
      prayer: string;
      devotional_date: string;
    };
  } | null;
  open: boolean;
  onClose: () => void;
}

export const DevotionalDetailModal = ({ devotional, open, onClose }: DevotionalDetailModalProps) => {
  if (!devotional) return null;

  const { devotional: dev, user_notes, completed_at } = devotional;
  const formattedDate = format(parseISO(dev.devotional_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const completedDate = format(parseISO(completed_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  const handleShare = async () => {
    const shareText = `DEVOCIONAL DIÁRIO
  
${formattedDate}
━━━━━━━━━━━━━━━━━━━━

${stripEmoji(dev.theme)}

━━━━━━━━━━━━━━━━━━━━
VERSÍCULO DO DIA
${dev.book_name} ${dev.chapter}:${dev.verse_start}${dev.verse_end ? `-${dev.verse_end}` : ''}

"${stripEmoji(dev.verse_text)}"

━━━━━━━━━━━━━━━━━━━━
INTRODUÇÃO

${stripEmoji(dev.introduction)}

━━━━━━━━━━━━━━━━━━━━
REFLEXÃO

${stripEmoji(dev.reflection)}

━━━━━━━━━━━━━━━━━━━━
PARA REFLETIR

${dev.question}

━━━━━━━━━━━━━━━━━━━━
APLICAÇÕES PRÁTICAS

${dev.practical_applications}

━━━━━━━━━━━━━━━━━━━━
ORAÇÃO

${stripEmoji(dev.prayer)}

━━━━━━━━━━━━━━━━━━━━`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          text: shareText,
          title: `Devocional: ${stripEmoji(dev.theme)}`
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          navigator.clipboard.writeText(shareText);
          toast.success("Conteúdo copiado!");
        }
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Conteúdo copiado para área de transferência!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{stripEmoji(dev.theme)}</DialogTitle>
              <p className="text-sm text-muted-foreground">{dev.book_name} {dev.chapter}:{dev.verse_start}
                {dev.verse_end && dev.verse_end !== dev.verse_start ? `-${dev.verse_end}` : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Lido em {completedDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <div className="space-y-6">
            {/* Versículo */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm italic leading-relaxed">{stripEmoji(dev.verse_text)}</p>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {dev.book_name} {dev.chapter}:{dev.verse_start}
                {dev.verse_end && dev.verse_end !== dev.verse_start ? `-${dev.verse_end}` : ''}
              </p>
            </div>

            {/* Introdução */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Introdução
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{stripEmoji(dev.introduction)}</p>
            </div>

            <Separator />

            {/* Reflexão */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Reflexão
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{stripEmoji(dev.reflection)}</p>
            </div>

            <Separator />

            {/* Pergunta */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Para Refletir
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{dev.question}</p>
            </div>

            <Separator />

            {/* Aplicações */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Aplicações Práticas
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{dev.practical_applications}</p>
            </div>

            <Separator />

            {/* Oração */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Oração
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{stripEmoji(dev.prayer)}</p>
            </div>

            {/* Anotações pessoais */}
            {user_notes && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-accent/50">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Minhas Anotações
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {user_notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
