import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send, Gift } from 'lucide-react';

const VipTokenManager = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-vip-token', {
        body: { email: email.trim(), fullName: fullName.trim() || null },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Token VIP enviado para ${email}`);
        setEmail('');
        setFullName('');
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
            Envie convites VIP por email para novos usuários
          </p>
        </div>

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Novo Convite VIP</CardTitle>
            <CardDescription>
              O destinatário receberá um email com link para completar o cadastro. O token expira em 48 horas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
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
