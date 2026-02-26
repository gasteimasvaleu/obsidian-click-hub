import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (!error) {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-24">
      <Card className="w-full max-w-md glass border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse jogos, e-books e todo o conteúdo exclusivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="space-y-3 pt-2">
            <p className="text-center text-sm text-muted-foreground">Assinar com:</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2 border-muted-foreground/30"
                onClick={() => toast.info('Em breve!')}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2 border-muted-foreground/30"
                onClick={() => toast.info('Em breve!')}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M3.18 23.67c-.56-.56-.97-1.33-1.22-2.29L1.87 18l5.23-3.03L3.18 23.67zm7.78-4.52L5.74 22.2l8.1-14.03 2.2 1.27-5.06 10.71zM20.16 18l-.09 3.38c-.25.96-.66 1.73-1.22 2.29L15 14.97l5.16-2.99V18zm1.97-7.27L4.67.55C5.23-.01 6-.29 6.96-.04l14.24 8.22c.96.55 1.53 1.22 1.53 2.04v.51h-.6zM2.04 5.27C1.67 5.83 1.44 6.55 1.44 7.44V16.56c0 .89.23 1.61.6 2.17l6.2-10.74L2.04 5.27z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
