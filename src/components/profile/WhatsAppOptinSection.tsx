import { useState, useEffect } from 'react';
import { BubbleSection } from '@/components/ui/bubble-section';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WhatsAppOptinSectionProps {
  userId: string;
}

export function WhatsAppOptinSection({ userId }: WhatsAppOptinSectionProps) {
  const { user } = useAuth();
  const userEmail = user?.email ?? '';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    fetchSubscriberData();
  }, [userId]);

  const fetchSubscriberData = async () => {
    try {
      // Busca por user_id OU e-mail (mesma regra do useSubscription),
      // pois há assinantes ativos com user_id vazio (ex.: login Apple).
      const filters = [`user_id.eq.${userId}`];
      if (userEmail) filters.push(`email.eq.${userEmail}`);

      const { data, error } = await supabase
        .from('subscribers')
        .select('phone, whatsapp_optin, subscription_expires_at')
        .or(filters.join(','))
        .eq('subscription_status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscriber data:', error);
        return;
      }

      const isActive =
        !!data &&
        (!data.subscription_expires_at ||
          new Date(data.subscription_expires_at) > new Date());

      if (isActive) {
        setHasSubscription(true);
        setOptedIn(data.whatsapp_optin ?? false);
        setPhone(data.phone ?? '');
        setOriginalPhone(data.phone ?? '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneDisplay = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneDisplay(e.target.value);
    setPhone(formatted);
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Brazilian phone: 10 or 11 digits (with 9th digit)
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const handleToggleOptin = async (checked: boolean) => {
    if (checked && !validatePhone(phone)) {
      toast.error('Por favor, insira um número de telefone válido');
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase.rpc as any)('update_my_whatsapp', { _optin: checked });

      if (error) throw error;

      setOptedIn(checked);
      toast.success(
        checked 
          ? 'Você receberá o devocional diário no WhatsApp!' 
          : 'Notificações do WhatsApp desativadas'
      );
    } catch (error) {
      console.error('Error updating opt-in:', error);
      toast.error('Erro ao atualizar preferências');
    } finally {
      setSaving(false);
    }
  };

  const normalizePhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return '';
    return cleaned.startsWith('55') ? cleaned : '55' + cleaned;
  };

  const handleSavePhone = async () => {
    if (!validatePhone(phone)) {
      toast.error('Por favor, insira um número de telefone válido');
      return;
    }

    setSaving(true);
    try {
      const cleanedPhone = normalizePhone(phone);

      const { error } = await (supabase.rpc as any)('update_my_whatsapp', { _phone: cleanedPhone });

      if (error) throw error;

      setOriginalPhone(phone);
      toast.success('Número de telefone atualizado!');
    } catch (error) {
      console.error('Error updating phone:', error);
      toast.error('Erro ao atualizar número');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BubbleSection title="Devocional no WhatsApp">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
      </BubbleSection>
    );
  }

  if (!hasSubscription) {
    return (
      <BubbleSection title="Devocional no WhatsApp">
          <p className="mb-3 text-sm text-muted-foreground">Receba o devocional diário no seu WhatsApp</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">
              Esta funcionalidade está disponível apenas para assinantes ativos.
            </p>
          </div>
      </BubbleSection>
    );
  }

  const phoneChanged = phone !== originalPhone && phone !== formatPhoneDisplay(originalPhone);

  return (
    <BubbleSection title="Devocional no WhatsApp" cardClassName="space-y-4">
        <p className="text-sm text-muted-foreground">Receba o devocional diário às 6h da manhã no seu WhatsApp</p>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="whatsapp-optin" className="text-base">
              Receber devocionais
            </Label>
            <p className="text-sm text-muted-foreground">
              {optedIn ? 'Notificações ativadas' : 'Notificações desativadas'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {optedIn && !saving && <Check className="w-4 h-4 text-primary" />}
            <Switch
              id="whatsapp-optin"
              checked={optedIn}
              onCheckedChange={handleToggleOptin}
              disabled={saving}
              className="data-[state=unchecked]:bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Número do WhatsApp</Label>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">+55</span>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="flex-1"
              maxLength={16}
            />
          </div>
          {phoneChanged && (
            <Button onClick={handleSavePhone} disabled={saving} className="h-11 w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Digite seu número com DDD (ex: 11999999999)
          </p>
        </div>
      </BubbleSection>
  );
}
