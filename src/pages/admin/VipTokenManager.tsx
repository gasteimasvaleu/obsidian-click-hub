import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send, Gift, Mail, MessageCircle } from 'lucide-react';

const VipTokenManager = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sendVia, setSendVia] = useState<'email' | 'whatsapp' | 'both'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const needsEmail = sendVia === 'email' || sendVia === 'both';
  const needsPhone = sendVia === 'whatsapp' || sendVia === 'both';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsEmail && !email) {
      toast.error('Email é obrigatório para envio por email');
      return;
    }
    if (needsPhone && !phone) {
      toast.error('Telefone é obrigatório para envio por WhatsApp');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-vip-token', {
        body: {
          email: email.trim() || null,
          fullName: fullName.trim() || null,
          phone: phone.replace(/\D/g, '') || null,
          sendVia,
        },
      });

      if (error) throw error;

      if (data.success) {
        const channel = sendVia === 'both' ? 'Email e WhatsApp' : sendVia === 'whatsapp' ? 'WhatsApp' : 'Email';
        toast.success(`Token VIP enviado via ${channel}!`);
        setEmail('');
        setFullName('');
        setPhone('');
      } else {
        toast.error(data.error || 'Erro ao enviar token');
      }
    } catch (error: any) {
      console.error('Error sending VIP token:', error);
      toast.error(error.message || 'Erro ao enviar token VIP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary" />
            Envio de Tokens VIP
          </h1>
          <p className="text-muted-foreground mt-1">
            Envie convites VIP por email ou WhatsApp para novos usuários
          </p>
        </div>

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Novo Convite VIP</CardTitle>
            <CardDescription>
              O destinatário receberá um convite com link para completar o cadastro. O token expira em 48 horas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sendVia">Enviar via</Label>
                <Select value={sendVia} onValueChange={(v) => setSendVia(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</span>
                    </SelectItem>
                    <SelectItem value="both">
                      <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Ambos</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome (opcional)</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nome do convidado"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {needsEmail && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={needsEmail}
                    disabled={isLoading}
                  />
                </div>
              )}

              {needsPhone && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    required={needsPhone}
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Token VIP
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VipTokenManager;
