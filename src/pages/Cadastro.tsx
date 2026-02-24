import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Mail, ShieldCheck } from 'lucide-react';

type TokenStatus = 'loading' | 'valid' | 'invalid' | 'expired' | 'success' | 'admin-mode';

interface SubscriberData {
  email: string;
  fullName: string;
  phone: string;
}

const Cadastro = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('loading');
  const [subscriberData, setSubscriberData] = useState<SubscriberData | null>(null);
  const [expiredEmail, setExpiredEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (authLoading) return;

    // If there's a token, use the normal flow
    if (token) {
      validateToken(token);
      return;
    }

    // No token - check if admin
    if (user && isAdmin) {
      setTokenStatus('admin-mode');
    } else {
      setTokenStatus('invalid');
    }
  }, [token, user, isAdmin, authLoading]);

  const validateToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('complete-signup', {
        body: { action: 'validate', token },
      });

      if (error) throw error;

      if (data.valid) {
        setSubscriberData(data.subscriber);
        setTokenStatus('valid');
      } else if (data.reason === 'expired') {
        setExpiredEmail(data.email);
        setTokenStatus('expired');
      } else {
        setTokenStatus('invalid');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setTokenStatus('invalid');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { email, password, fullName, phone },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Usuário criado com sucesso!');
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(data.error || 'Erro ao criar usuário');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('complete-signup', {
        body: {
          action: 'complete',
          token,
          password,
          fullName,
          phone,
        },
      });

      if (error) throw error;

      if (data.success) {
        setTokenStatus('success');
        toast.success('Conta criada com sucesso!');
        setTimeout(() => navigate('/download'), 3000);
      } else {
        toast.error(data.message || 'Erro ao criar conta');
      }
    } catch (error: any) {
      console.error('Error completing signup:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (tokenStatus) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Validando...</p>
          </div>
        );

      case 'admin-mode':
        return (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-primary text-sm flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Modo Admin: Você pode cadastrar novos usuários manualmente.
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemplo.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nome do usuário"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme a senha"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando usuário...
                </>
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </form>
        );

      case 'invalid':
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Link Inválido</h2>
            <p className="text-muted-foreground mb-6">
              Este link de cadastro não é válido ou já foi utilizado.
            </p>
            <Button onClick={() => navigate('/login')} variant="outline">
              Ir para Login
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Link Expirado</h2>
            <p className="text-muted-foreground mb-6">
              Este link expirou. Entre em contato conosco para receber um novo link.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Email: {expiredEmail}
            </p>
            <Button onClick={() => navigate('/login')} variant="outline">
              Ir para Login
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Conta Criada!</h2>
            <p className="text-muted-foreground mb-4">
              Sua conta foi criada com sucesso. Você será redirecionado para o login...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        );

      case 'valid':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Não recebeu o email? Verifique sua caixa de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={subscriberData?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={subscriberData?.fullName || ''}
                placeholder="Seu nome completo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={subscriberData?.phone || ''}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-24">
      <Card className="w-full max-w-md glass border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            {tokenStatus === 'valid' ? 'Complete seu Cadastro' : tokenStatus === 'admin-mode' ? 'Cadastrar Usuário' : 'Cadastro'}
          </CardTitle>
          {tokenStatus === 'valid' && (
            <CardDescription className="text-muted-foreground">
              Defina sua senha para acessar a plataforma
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;
