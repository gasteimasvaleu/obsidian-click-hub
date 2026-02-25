import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";

interface ParentalGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ParentalGate({ open, onOpenChange, onSuccess }: ParentalGateProps) {
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  // Generate new challenge when modal opens
  useEffect(() => {
    if (open) {
      setNumA(Math.floor(Math.random() * 13) + 3); // 3-15
      setNumB(Math.floor(Math.random() * 13) + 3);
      setAnswer("");
      setError(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer, 10) === numA + numB) {
      onOpenChange(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>Verificação dos Pais</DialogTitle>
          <DialogDescription>
            Para continuar, peça a um adulto para resolver:
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-2xl font-bold text-foreground">
            Quanto é {numA} + {numB}?
          </p>

          <Input
            type="number"
            inputMode="numeric"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="Digite a resposta"
            className="text-center text-lg"
            autoFocus
          />

          {error && (
            <p className="text-center text-sm text-destructive">
              Resposta incorreta, tente novamente.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={!answer}>
            Confirmar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
