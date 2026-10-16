import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface ParentalGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ParentalGate({ open, onOpenChange, onSuccess }: ParentalGateProps) {
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      const a = Math.floor(Math.random() * 13) + 3;
      const b = Math.floor(Math.random() * 13) + 3;
      const sum = a + b;
      const set = new Set<number>([sum]);
      while (set.size < 4) {
        const d = sum + (Math.floor(Math.random() * 9) - 4);
        if (d > 0) set.add(d);
      }
      setNumA(a);
      setNumB(b);
      setOptions([...set].sort(() => Math.random() - 0.5));
      setError(false);
    }
  }, [open]);

  const choose = (value: number) => {
    if (value === numA + numB) {
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

        <div className="space-y-4">
          <p className="text-center text-2xl font-bold text-foreground">
            Quanto é {numA} + {numB}?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {options.map((o) => (
              <Button key={o} variant="outline" className="h-12 text-lg" onClick={() => choose(o)}>
                {o}
              </Button>
            ))}
          </div>
          {error && (
            <p className="text-center text-sm text-destructive">
              Resposta incorreta, tente novamente.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
