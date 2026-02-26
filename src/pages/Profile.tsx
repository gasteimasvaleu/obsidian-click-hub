import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Activity, LogOut, Camera, BookOpen, StickyNote, Music, Trash2 } from 'lucide-react';
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

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { progress, badges, activities, loading: progressLoading } = useUserProgress();
  const navigate = useNavigate();
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

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

      await supabase.auth.signOut();
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
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };
    
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleAvatarUploadSuccess = (url: string) => {
    setAvatarUrl(url);
  };

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !progress) return null;

  const levelProgress = ((progress.total_points % 100) / 100) * 100;
  const nextLevelPoints = (progress.level * 100) - progress.total_points;

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 pb-28 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <Card className="glass border-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/30">
                  <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Alterar foto"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user.user_metadata?.full_name || 'Usuário'}
                </h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Trophy className="w-3 h-3 mr-1" />
                    Nível {progress.level}
                  </Badge>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Star className="w-3 h-3 mr-1" />
                    {progress.total_points} pontos
                  </Badge>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    <Target className="w-3 h-3 mr-1" />
                    {badges.length} conquistas
                  </Badge>
                </div>
              </div>

              <div className="w-full md:w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Próximo nível</span>
                    <span className="text-primary font-medium">{nextLevelPoints} pts</span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-primary/20 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="w-full md:w-auto border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto border-red-700/50 text-red-700 hover:bg-red-700/10 hover:text-red-600"
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? 'Excluindo...' : 'Excluir Conta'}
                  </Button>
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
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, excluir minha conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <AppearanceSection />

        <WhatsAppOptinSection userId={user.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glass border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Jogos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{progress.games_completed}</p>
              <p className="text-sm text-muted-foreground">jogos completados</p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Músicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{progress.ebooks_read}</p>
              <p className="text-sm text-muted-foreground">músicas ouvidas</p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Devocionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{progress.devotionals_completed ?? 0}</p>
              <p className="text-sm text-muted-foreground">devocionais lidos</p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Sequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{progress.streak_days}</p>
              <p className="text-sm text-muted-foreground">dias seguidos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-primary/20 relative z-10">
          <CardContent className="pt-6">
            <Tabs defaultValue="badges">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 !h-auto gap-1 p-1 overflow-visible">
                <TabsTrigger value="badges">Conquistas</TabsTrigger>
                <TabsTrigger value="activities">Atividades</TabsTrigger>
                <TabsTrigger value="devotionals">Devocionais</TabsTrigger>
                <TabsTrigger value="notes">
                  <StickyNote className="w-4 h-4 mr-1 hidden sm:inline" />
                  Anotações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="badges" className="mt-4">
                {badges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma conquista ainda. Continue jogando e aprendendo!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-4 rounded-lg bg-primary/10 border border-primary/20"
                      >
                        <Trophy className="w-8 h-8 text-primary mb-2" />
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
                        className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
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
          </CardContent>
        </Card>

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
  };
  return names[badgeType] || badgeType;
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
