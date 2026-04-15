import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { purchaseMonthly, restorePurchases, isNativePlatform, getPlatform } from '@/lib/revenuecat';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { nativeAppleSignIn } from '@/lib/native-apple-signin';
import { nativeGoogleSignIn } from '@/lib/native-google-signin';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isAppleSigningIn, setIsAppleSigningIn] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isNativePlatform()) {
      restorePurchases().then((result) => {
        if (result.success && result.isActive) {
          setHasPurchased(true);
        }
      }).catch(() => {});
    }
  }, []);

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

  const handleAppleSignIn = async () => {
    setIsAppleSigningIn(true);
    try {
      if (isNativePlatform()) {
        // Native: use custom Apple Sign In plugin + signInWithIdToken
        const result = await nativeAppleSignIn();
        const identityToken = result.identityToken;
        
        if (!identityToken) {
          toast.error('Não foi possível obter o token da Apple.');
          return;
        }

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: identityToken,
        });

        if (error) {
          console.error('Supabase signInWithIdToken error:', error);
          toast.error(error.message || 'Erro ao autenticar com Apple');
        } else {
          toast.success('Login realizado com sucesso!');
          if (data?.user) {
            // Save Apple name to profile (Apple only sends name on first auth)
            const appleName = [result.givenName, result.familyName].filter(Boolean).join(' ').trim();
            const displayName = appleName || 'Usuário Apple';
            
            // Update profile name if it's empty or default
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', data.user.id)
              .maybeSingle();
            
            if (!profile?.full_name || profile.full_name === 'Usuário' || profile.full_name === 'Usuário Apple') {
              await supabase
                .from('profiles')
                .update({ full_name: displayName })
                .eq('id', data.user.id);
              
              // Also update user metadata so it's available immediately
              await supabase.auth.updateUser({
                data: { full_name: displayName },
              });
            }

            // RevenueCat identify+sync is handled by AuthContext onAuthStateChange
          }
          navigate('/');
        }
      } else {
        // Web fallback: OAuth redirect
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          toast.error(error.message || 'Erro ao fazer login com Apple');
        }
      }
    } catch (error: any) {
      console.error('Apple Sign In error:', error);
      if (error?.message?.includes('cancelled') || error?.code === '1001') {
        // User cancelled, do nothing
      } else {
        toast.error('Erro ao fazer login com Apple');
      }
    } finally {
      setIsAppleSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    try {
      if (isNativePlatform()) {
        const result = await nativeGoogleSignIn();
        
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: result.idToken,
        });

        if (error) {
          console.error('Supabase signInWithIdToken (Google) error:', error);
          toast.error(error.message || 'Erro ao autenticar com Google');
        } else {
          toast.success('Login realizado com sucesso!');
          if (data?.user) {
            const displayName = result.displayName || result.email || 'Usuário Google';
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', data.user.id)
              .maybeSingle();
            
            if (!profile?.full_name || profile.full_name === 'Usuário' || profile.full_name === 'Usuário Google') {
              await supabase
                .from('profiles')
                .update({ full_name: displayName })
                .eq('id', data.user.id);
              
              await supabase.auth.updateUser({
                data: { full_name: displayName },
              });
            }
          }
          navigate('/');
        }
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          toast.error(error.message || 'Erro ao fazer login com Google');
        }
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error?.message?.includes('canceled') || error?.message?.includes('cancelled')) {
        // User cancelled
      } else {
        toast.error(`Erro Google: ${error?.message || JSON.stringify(error)}`);
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleAppStorePurchase = async () => {
    if (!isNativePlatform()) {
      toast.info('Assinaturas só estão disponíveis no app nativo (iOS).');
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchaseMonthly();

      if (result.success) {
        toast.success('Assinatura realizada! Agora toque em "Continuar com Apple" para criar sua conta.', { duration: 8000 });
        setHasPurchased(true);
      } else if (result.error === 'cancelled') {
        // User cancelled, do nothing
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error?.message ?? 'Erro ao processar a compra.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();

      if (result.success && result.isActive) {
        toast.success('Assinatura restaurada com sucesso! Faça login para continuar.');
      } else if (result.success && !result.isActive) {
        toast.info('Nenhuma assinatura ativa encontrada.');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      toast.error('Erro ao restaurar compras.');
    } finally {
      setIsRestoring(false);
    }
  };

  const platform = getPlatform();

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
          {/* Sign in with Apple - Apple HIG compliant */}
          {platform !== 'android' && (
            <div className="space-y-2">
              <Button
                type="button"
                className="w-full h-12 gap-3 bg-white text-black hover:bg-white/90 font-medium text-base rounded-lg disabled:opacity-50"
                disabled={isAppleSigningIn || !hasPurchased}
                onClick={handleAppleSignIn}
              >
                {isAppleSigningIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                Continuar com Apple
              </Button>
              {!hasPurchased && (
                <p className="text-xs text-center text-muted-foreground">
                  Assine primeiro abaixo para habilitar o login com Apple
                </p>
              )}
            </div>
          )}

          {/* Sign in with Google - visible on Android */}
          {platform === 'android' && (
            <div className="space-y-2">
              <Button
                type="button"
                className="w-full h-12 gap-3 bg-white text-black hover:bg-white/90 font-medium text-base rounded-lg disabled:opacity-50"
                disabled={isGoogleSigningIn || !hasPurchased}
                onClick={handleGoogleSignIn}
              >
                {isGoogleSigningIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continuar com Google
              </Button>
              {!hasPurchased && (
                <p className="text-xs text-center text-muted-foreground">
                  Assine primeiro abaixo para habilitar o login com Google
                </p>
              )}
            </div>
          )}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

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
              {platform !== 'android' && (
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2 border-muted-foreground/30"
                  disabled={isPurchasing}
                  onClick={handleAppStorePurchase}
                >
                  {isPurchasing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )}
                  App Store
                </Button>
              )}
              {platform === 'android' && (
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2 border-muted-foreground/30"
                  disabled={isPurchasing}
                  onClick={handleAppStorePurchase}
                >
                  {isPurchasing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M3.18 23.67c-.56-.56-.97-1.33-1.22-2.29L1.87 18l5.23-3.03L3.18 23.67zm7.78-4.52L5.74 22.2l8.1-14.03 2.2 1.27-5.06 10.71zM20.16 18l-.09 3.38c-.25.96-.66 1.73-1.22 2.29L15 14.97l5.16-2.99V18zm1.97-7.27L4.67.55C5.23-.01 6-.29 6.96-.04l14.24 8.22c.96.55 1.53 1.22 1.53 2.04v.51h-.6zM2.04 5.27C1.67 5.83 1.44 6.55 1.44 7.44V16.56c0 .89.23 1.61.6 2.17l6.2-10.74L2.04 5.27z"/>
                    </svg>
                  )}
                  Google Play
                </Button>
              )}
            </div>

            {/* Subscription info - required by Apple Guideline 3.1.2(c) */}
            <div className="text-center space-y-1 pt-1">
              <p className="text-xs text-muted-foreground font-medium">
                BíbliaToon Club Premium — Assinatura Mensal
              </p>
              <p className="text-xs text-muted-foreground/70">
                Renovação automática. Cancele a qualquer momento nas configurações da {platform === 'android' ? 'Google Play' : 'App Store'}.
              </p>
            </div>

            {/* Restore purchases - required by Apple Guideline 3.1.1 */}
            {isNativePlatform() && (
              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-muted-foreground underline"
                  disabled={isRestoring}
                  onClick={handleRestorePurchases}
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Restaurando...
                    </>
                  ) : (
                    'Restaurar Compras'
                  )}
                </Button>
              </div>
            )}

            {/* Legal links - required by Apple Guideline 3.1.2(c) */}
            <div className="flex justify-center gap-4 pt-1">
              <Link
                to="/termos-de-uso"
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                to="/politica-familia"
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
