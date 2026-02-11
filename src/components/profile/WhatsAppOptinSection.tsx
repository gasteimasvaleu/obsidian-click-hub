import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle, Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WhatsAppOptinSectionProps {
  userId: string;
}

export function WhatsAppOptinSection({ userId }: WhatsAppOptinSectionProps) {
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
      const { data, error } = await supabase
        .from('subscribers')
        .select('phone, whatsapp_optin')
        .eq('user_id', userId)
        .eq('subscription_status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscriber data:', error);
        return;
      }

      if (data) {
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
      const { error } = await supabase
        .from('subscribers')
        .update({
          whatsapp_optin: checked,
          whatsapp_optin_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('subscription_status', 'active');

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
      
      const { error } = await supabase
        .from('subscribers')
        .update({ phone: cleanedPhone })
        .eq('user_id', userId)
        .eq('subscription_status', 'active');

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
      <Card className="glass border-primary/20 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasSubscription) {
    return (
      <Card className="glass border-primary/20 mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Devocional no WhatsApp
          </CardTitle>
          <CardDescription>
            Receba o devocional diário no seu WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">
              Esta funcionalidade está disponível apenas para assinantes ativos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const phoneChanged = phone !== originalPhone && phone !== formatPhoneDisplay(originalPhone);

  return (
    <Card className="glass border-primary/20 mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-500" />
          Devocional no WhatsApp
        </CardTitle>
        <CardDescription>
          Receba o devocional diário às 6h da manhã no seu WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {optedIn && !saving && <Check className="w-4 h-4 text-green-500" />}
            <Switch
              id="whatsapp-optin"
              checked={optedIn}
              onCheckedChange={handleToggleOptin}
              disabled={saving}
              className="data-[state=unchecked]:bg-white/20"
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
            {phoneChanged && (
              <Button 
                onClick={handleSavePhone} 
                disabled={saving}
                size="sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Digite seu número com DDD (ex: 11999999999)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
