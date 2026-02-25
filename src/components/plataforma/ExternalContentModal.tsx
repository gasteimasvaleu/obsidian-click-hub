import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParentalGate } from "@/components/ParentalGate";

interface ExternalContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
}

export function ExternalContentModal({
  open,
  onOpenChange,
  url,
  title = "Conteúdo externo",
}: ExternalContentModalProps) {
  const [showGate, setShowGate] = useState(false);

  const openInNewTab = () => {
    setShowGate(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir em nova aba
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </DialogContent>

      <ParentalGate
        open={showGate}
        onOpenChange={setShowGate}
        onSuccess={() => window.open(url, "_blank", "noopener,noreferrer")}
      />
    </Dialog>
  );
}
