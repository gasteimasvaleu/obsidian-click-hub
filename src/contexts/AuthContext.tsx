import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Detectar eventos de desconexão
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Identify user in RevenueCat
          import('@/lib/revenuecat').then(({ identifyUser }) => {
            identifyUser(session.user.id);
          });
          // Verificar se o usuário ainda existe no banco
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .maybeSingle();
              
              // Se o perfil não existe, usuário foi deletado
              if (error || !profile) {
                console.log('User deleted, signing out...');
                await supabase.auth.signOut();
                return;
              }
              
              checkAdminStatus(session.user.id);
            } catch (err) {
              console.error('Error checking user existence:', err);
              setIsAdmin(false);
              setLoading(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    }

    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Mesmo se houver erro (como session_not_found), limpar estado local
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      if (error) {
        // Se for erro de sessão não encontrada, apenas logar
        // O logout local já foi feito
        console.log('Logout server-side falhou (sessão provavelmente já expirada):', error.message);
      }
      
      toast.success('Logout realizado com sucesso');
    } catch (err) {
      // Fallback: limpar estado local mesmo em caso de exceção
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('sb-fnksvazibtekphseknob-auth-token');
      toast.success('Logout realizado com sucesso');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
