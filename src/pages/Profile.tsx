import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Activity, LogOut, Camera, BookOpen, StickyNote, Music, Trash2, Lock, Crown, Pencil, Loader2, Flame } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { APP_BUNDLE_VERSION } from '@/lib/revenuecat';
import { Paywall } from '@/components/Paywall';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { DevotionalHistoryTab } from '@/components/profile/DevotionalHistoryTab';
import { VerseNotesTab } from '@/components/profile/VerseNotesTab';
import { AppearanceSection } from '@/components/profile/AppearanceSection';
import { WhatsAppOptinSection } from '@/components/profile/WhatsAppOptinSection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { BubbleSection, SPLIT_BAR } from '@/components/ui/bubble-section';

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { progress, badges, activities, loading: progressLoading } = useUserProgress();
  const navigate = useNavigate();
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [deleting, setDeleting] = useState(false);
  const { isActive: isPremium, loading: subLoading, refresh: refreshSubscription } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        navigate('/login');
        return;
      }

      const res = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw res.error;

      await signOut();
      toast.success('Conta excluída com sucesso.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir conta. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  // Fetch profile data including avatar_url
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
      if (data?.full_name) {
        setProfileName(data.full_name);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch subscription expiry date for premium users
  useEffect(() => {
    const fetchExpiry = async () => {
      if (!user || !isPremium) return;
      const { data } = await supabase
        .from('subscribers')
        .select('subscription_expires_at')
        .or(`user_id.eq.${user.id}${user.email ? `,email.eq.${user.email}` : ''}`)
        .eq('subscription_status', 'active')
        .order('subscription_expires_at', { ascending: false })
        .limit(1);
      setExpiresAt(data?.[0]?.subscription_expires_at ?? null);
    };
    fetchExpiry();
  }, [user, isPremium]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleAvatarUploadSuccess = (url: string) => {
    setAvatarUrl(url);
  };

  const openNameDialog = () => {
    setNameInput(displayName);
    setShowNameDialog(true);
  };

  const handleSaveName = async () => {
    const newName = nameInput.trim();
    if (!newName) {
      toast.error('Digite um nome válido.');
      return;
    }
    if (newName.length > 60) {
      toast.error('O nome pode ter no máximo 60 caracteres.');
      return;
    }

    setSavingName(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user!.id);
      if (profileError) throw profileError;

      // Atualiza também os metadados de auth para refletir na hora
      await supabase.auth.updateUser({ data: { full_name: newName } });

      setProfileName(newName);
      setShowNameDialog(false);
      toast.success('Nome atualizado!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar o nome. Tente novamente.');
    } finally {
      setSavingName(false);
    }
  };

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FuturisticNavbar />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !progress) return null;

  const levelProgress = ((progress.total_points % 100) / 100) * 100;
  const nextLevelPoints = (progress.level * 100) - progress.total_points;
  const displayName =
    profileName ||
    user.user_metadata?.full_name ||
    (user.email?.includes('privaterelay.appleid.com') ? 'Usuário Apple' : 'Usuário');

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-20 max-w-[58rem]">
        <BubbleSection
          as="h1"
          title={displayName}
          titleExtra={
            <button
              onClick={openNameDialog}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/20 transition-colors hover:bg-background/30"
              title="Editar nome"
              aria-label="Editar nome"
            >
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/30">
                <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {displayName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowAvatarUpload(true)}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md"
                title="Alterar foto"
                aria-label="Alterar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="w-full flex-1 space-y-3 text-center md:text-left">
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground md:justify-start">
                {user.email?.includes('privaterelay.appleid.com') ? (
                  <><Lock className="h-3.5 w-3.5" /><span>E-mail protegido pela Apple</span></>
                ) : (
                  <span className="truncate">{user.email}</span>
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"><Trophy className="h-3 w-3" />Nível {progress.level}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"><Star className="h-3 w-3" />{progress.total_points} pontos</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"><Target className="h-3 w-3" />{badges.length} conquistas</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Próximo nível</span>
                  <span className="font-semibold text-primary">{nextLevelPoints} pts</span>
                </div>
                <Progress value={levelProgress} className="h-3 rounded-full bg-primary/15" />
              </div>
            </div>
          </div>

          <div className={`${SPLIT_BAR} mt-5`}>
            <button type="button" onClick={handleLogout} className="flex h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sair da Conta
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" disabled={deleting} className="flex h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50">
                  <Trash2 className="h-4 w-4" /> {deleting ? 'Excluindo...' : 'Excluir Conta'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação é irreversível. Todos os seus dados, progresso, conquistas e criações serão permanentemente removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sim, excluir minha conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </BubbleSection>

        {!subLoading && (
          <BubbleSection title={isPremium ? 'Assinante Premium' : 'Seja Premium'}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {isPremium
                  ? <>Acesso completo a todas as aulas{expiresAt && ` · Renova em ${new Date(expiresAt).toLocaleDateString('pt-BR')}`}</>
                  : 'Aulas em vídeo ilimitadas, novos cursos e materiais de apoio para pais e catequistas.'}
              </p>
            </div>
            {!isPremium && (
              <Button className="mt-4 h-11 w-full" onClick={() => setShowPaywall(true)}>Assinar agora</Button>
            )}
          </BubbleSection>
        )}

        <AppearanceSection />

        <WhatsAppOptinSection userId={user.id} />

        <BubbleSection title="Seu progresso">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Activity, value: progress.games_completed, label: 'jogos completados', title: 'Jogos' },
              { icon: Music, value: progress.ebooks_read, label: 'músicas ouvidas', title: 'Músicas' },
              { icon: BookOpen, value: progress.devotionals_completed ?? 0, label: 'devocionais lidos', title: 'Devocionais' },
              { icon: Flame, value: progress.streak_days, label: 'dias seguidos', title: 'Sequência' },
            ].map(({ icon: Icon, value, label, title }) => (
              <div key={title} className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 text-center">
                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-black text-primary">{value}</p>
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </BubbleSection>

        <BubbleSection title="Minha jornada" className="relative z-10">
          <Tabs defaultValue="badges">
            <TabsList className={`${SPLIT_BAR} !h-auto p-0`}>
              {[
                { v: 'badges', l: 'Conquistas', i: Trophy },
                { v: 'activities', l: 'Atividades', i: Activity },
                { v: 'devotionals', l: 'Devocionais', i: BookOpen },
                { v: 'notes', l: 'Anotações', i: StickyNote },
              ].map(({ v, l, i: Icon }) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="flex h-14 min-w-0 flex-1 flex-col gap-0.5 rounded-none px-1 text-[10px] text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="max-w-full truncate">{l}</span>
                </TabsTrigger>
              ))}
            </TabsList>
              <TabsContent value="badges" className="mt-4">
                {badges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma conquista ainda. Continue jogando e aprendendo!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10"><Trophy className="h-5 w-5 text-primary" /></div>
                        <p className="text-sm text-center font-medium">
                          {getBadgeName(badge.badge_type)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(badge.earned_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activities" className="mt-4">
                {activities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma atividade registrada ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{activity.activity_title}</p>
                            <p className="text-xs text-muted-foreground">
                              {getActivityTypeName(activity.activity_type)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-medium">+{activity.points_earned} pts</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.completed_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="devotionals" className="mt-4">
                <DevotionalHistoryTab userId={user.id} />
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <VerseNotesTab userId={user.id} />
              </TabsContent>
          </Tabs>
        </BubbleSection>

        {/* Edit Name Dialog */}
        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar nome</DialogTitle>
              <DialogDescription>
                Esse é o nome exibido no seu perfil.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome"
                maxLength={60}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNameDialog(false)} disabled={savingName}>
                Cancelar
              </Button>
              <Button onClick={handleSaveName} disabled={savingName}>
                {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Avatar Upload Modal */}
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          userId={user.id}
          userName={user.user_metadata?.full_name}
          userEmail={user.email}
          open={showAvatarUpload}
          onOpenChange={setShowAvatarUpload}
          onUploadSuccess={handleAvatarUploadSuccess}
        />

        {/* Paywall Premium */}
        {showPaywall && (
          <Paywall
            onUnlocked={() => { setShowPaywall(false); refreshSubscription(); }}
            onClose={() => setShowPaywall(false)}
          />
        )}

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          versão {APP_BUNDLE_VERSION}
        </p>
      </div>
    </div>
  );
};

const getBadgeName = (badgeType: string): string => {
  const names: { [key: string]: string } = {
    first_game: 'Primeiro Jogo',
    games_5: '5 Jogos',
    games_10: '10 Jogos',
    first_ebook: 'Primeira Música',
    ebooks_5: '5 Músicas',
    level_5: 'Nível 5',
    level_10: 'Nível 10',
    first_coloring: 'Primeira Pintura',
    coloring_5: '5 Pinturas',
    first_devotional: 'Primeiro Devocional',
    devotionals_5: '5 Devocionais',
    streak_7: '7 Dias Seguidos',
  };
  return names[badgeType] || badgeType.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
};

const getActivityTypeName = (type: string): string => {
  const names: { [key: string]: string } = {
    game_completed: 'Jogo completado',
    ebook_read: 'Música ouvida',
    music_listened: 'Música ouvida',
    coloring_completed: 'Colorir completado',
  };
  return names[type] || type;
};

export default Profile;
