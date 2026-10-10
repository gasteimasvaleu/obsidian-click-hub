import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { ParentalGate } from '@/components/ParentalGate';
import { useAuth } from '@/contexts/AuthContext';
import {
  purchaseMonthly, restorePurchases, isNativePlatform, getPlatform, syncSubscriptionAfterLogin,
} from '@/lib/revenuecat';

interface PaywallProps {
  onUnlocked: () => void;
  onClose?: () => void;
}

const benefits = [
  'Todas as aulas em vídeo dos Cursos, sem limite',
  'Novos cursos e módulos assim que forem lançados',
  'Materiais de apoio para pais e catequistas',
];

export function Paywall({ onUnlocked, onClose }: PaywallProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [price, setPrice] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const platform = getPlatform();
  const store = platform === 'android' ? 'Google Play' : 'App Store';

  useEffect(() => {
    if (!isNativePlatform()) return;
    import('@revenuecat/purchases-capacitor').then(async ({ Purchases }) => {
      try {
        const o = await Purchases.getOfferings();
        const p = o?.current?.availablePackages?.[0]?.product?.priceString;
        if (p) setPrice(p);
      } catch { /* ignore */ }
    });
  }, []);

  const afterSuccess = async () => {
    if (user) await syncSubscriptionAfterLogin(user.id, user.email ?? '');
    onUnlocked();
  };

  const doPurchase = async () => {
    if (!isNativePlatform()) {
      toast.info(`A assinatura está disponível no app (${store}).`);
      return;
    }
    setPurchasing(true);
    try {
      const r = await purchaseMonthly();
      if (r.success) { toast.success('Assinatura ativada!'); await afterSuccess(); }
      else if (r.error && r.error !== 'cancelled') toast.error(r.error);
    } finally { setPurchasing(false); }
  };

  const doRestore = async () => {
    setRestoring(true);
    try {
      const r = await restorePurchases();
      if (r.isActive) { toast.success('Assinatura restaurada!'); await afterSuccess(); }
      else if (r.success) toast.info('Nenhuma assinatura ativa encontrada.');
      else if (r.error) toast.error(r.error);
    } finally { setRestoring(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background overflow-y-auto pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto px-6 flex flex-col min-h-full">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" aria-label="Fechar" onClick={() => (onClose ? onClose() : navigate(-1))}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Você assistiu suas 3 aulas grátis</h1>
          <p className="text-muted-foreground mt-2">Assine o BíbliaToon Club Premium para continuar.</p>
        </div>

        <ul className="mt-8 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex gap-3 items-start">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-xl border border-primary/30 p-4 text-center">
          <p className="font-semibold text-foreground">BíbliaToon Club Premium — Assinatura Mensal</p>
          <p className="text-2xl font-bold text-primary mt-1">{price ? `${price}/mês` : 'Mensal'}</p>
        </div>

        <Button className="w-full h-12 mt-6 text-base" disabled={purchasing} onClick={() => setGateOpen(true)}>
          {purchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Assinar'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Renovação automática. Cancele a qualquer momento nas configurações da {store}.
        </p>

        {isNativePlatform() && (
          <Button variant="link" size="sm" className="text-xs text-muted-foreground underline mt-2" disabled={restoring} onClick={doRestore}>
            {restoring ? 'Restaurando...' : 'Restaurar Compras'}
          </Button>
        )}

        <div className="flex justify-center gap-4 mt-2">
          <Link to="/termos-de-uso" className="text-xs text-muted-foreground underline">Termos de Uso</Link>
          <Link to="/politica-familia" className="text-xs text-muted-foreground underline">Política de Privacidade</Link>
        </div>
      </div>

      <ParentalGate open={gateOpen} onOpenChange={setGateOpen} onSuccess={() => { setGateOpen(false); doPurchase(); }} />
    </div>
  );
}
