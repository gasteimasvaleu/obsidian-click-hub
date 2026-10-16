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

const GooglePlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1Zm11.6 11.6 2.5 2.5-11.3 6.4 8.8-8.9Zm3.9-5.3 3 1.7c.9.5.9 1.9 0 2.4l-3 1.7-2.8-2.8 2.8-3Zm-12.7-6.4 11.3 6.4-2.5 2.5-8.8-8.9Z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.3 3-2.5 1-1.4 1.4-2.8 1.4-2.8 0 0-2.7-1-2.7-4.1ZM13.9 4.9c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
  </svg>
);

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
    <div className="fixed inset-0 z-[60] bg-background overflow-y-auto flex flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="glass relative rounded-2xl p-4 mx-auto my-auto w-full max-w-md flex flex-col neon-glow-user">
        <span aria-hidden className="border-beam" />
        <Button variant="ghost" size="icon" aria-label="Fechar"
          className="absolute right-1 top-1 z-10"
          onClick={() => (onClose ? onClose() : navigate(-1))}>
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center mb-2">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground leading-tight">Você assistiu suas 3 aulas grátis</h1>
          <p className="text-sm text-muted-foreground mt-1">Assine o BíbliaToon Club Premium para continuar.</p>
        </div>

        <ul className="mt-3 space-y-1.5">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2 items-start text-sm">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/30 px-3 py-2">
          <p className="text-sm font-semibold text-foreground">Premium Mensal</p>
          <p className="text-lg font-bold text-primary">{price ? `${price}/mês` : 'Mensal'}</p>
        </div>

        <Button
          className="w-full h-12 mt-3 text-base gap-2"
          disabled={purchasing}
          onClick={() => (platform === 'android' ? doPurchase() : setGateOpen(true))}
        >
          {purchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              {platform === 'android' ? <GooglePlayIcon /> : <AppleIcon />}
              Assinar com {store}
            </>
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Renovação automática. Cancele a qualquer momento na {store}.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 mt-1 text-[11px] text-muted-foreground">
          {isNativePlatform() && (
            <button className="underline py-1" disabled={restoring} onClick={doRestore}>
              {restoring ? 'Restaurando...' : 'Restaurar Compras'}
            </button>
          )}
          <Link to="/termos-de-uso" className="underline py-1">Termos de Uso</Link>
          <Link to="/politica-familia" className="underline py-1">Privacidade</Link>
        </div>
      </div>

      <ParentalGate open={gateOpen} onOpenChange={setGateOpen} onSuccess={() => { setGateOpen(false); doPurchase(); }} />
    </div>
  );
}
