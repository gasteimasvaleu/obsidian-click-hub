import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";

interface AIConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

const INTRO =
  "Algumas funcionalidades do app utilizam inteligência artificial para gerar conteúdo personalizado. Antes de continuar, gostaríamos de informar:";

export const AIConsentDialog = ({ open, onAccept, onCancel }: AIConsentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl sm:rounded-3xl border border-primary/40 max-h-[85vh] flex flex-col">
        <DialogTitle className="sr-only">Uso de Inteligência Artificial</DialogTitle>
        <DialogDescription className="sr-only">{INTRO}</DialogDescription>

        <SectionHeader title="Uso de Inteligência Artificial" description={INTRO} className="mb-0 mt-4 shrink-0" />

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 rounded-2xl border border-primary/30 bg-card p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Dados enviados:</p>
          <p>Mensagens de texto, informações de formulários (como nome e idade da criança) ou fotos que você enviar para funcionalidades de IA.</p>

          <p className="font-semibold text-foreground">Para quem:</p>
          <p>Os dados são processados pelo serviço de inteligência artificial do Google (Gemini) através dos nossos servidores seguros.</p>

          <p className="font-semibold text-foreground">Proteção:</p>
          <p>Os dados são usados exclusivamente para gerar o conteúdo solicitado e não são armazenados pelo serviço de IA. Sua privacidade é nossa prioridade.</p>

          <p className="text-xs pt-1">Para mais detalhes, consulte nossa Política de Privacidade.</p>
        </div>

        <DialogFooter className="shrink-0 flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={onAccept} className="w-full h-11">
            Concordo e quero continuar
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full h-11 border-primary text-primary hover:bg-primary/10 hover:text-primary">
            Agora não
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
