import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface AIConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const AIConsentDialog = ({ open, onAccept, onCancel }: AIConsentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-lg">Uso de Inteligência Artificial</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p>
              Algumas funcionalidades do app utilizam inteligência artificial para gerar conteúdo personalizado. Antes de continuar, gostaríamos de informar:
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-foreground">Dados enviados:</p>
              <p>Mensagens de texto, informações de formulários (como nome e idade da criança) ou fotos que você enviar para funcionalidades de IA.</p>
              
              <p className="font-semibold text-foreground">Para quem:</p>
              <p>Os dados são processados pelo serviço de inteligência artificial do Google (Gemini) através dos nossos servidores seguros.</p>
              
              <p className="font-semibold text-foreground">Proteção:</p>
              <p>Os dados são usados exclusivamente para gerar o conteúdo solicitado e não são armazenados pelo serviço de IA. Sua privacidade é nossa prioridade.</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Para mais detalhes, consulte nossa Política de Privacidade.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onAccept} className="w-full">
            Concordo e quero continuar
          </Button>
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Agora não
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
