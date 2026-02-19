import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProgress {
  total_points: number;
  level: number;
  games_completed: number;
  ebooks_read: number;
  coloring_completed: number;
  devotionals_completed: number;
  streak_days: number;
  last_activity_date: string | null;
}

interface Badge {
  id: string;
  badge_type: string;
  earned_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  activity_title: string | null;
  points_earned: number;
  completed_at: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
      fetchBadges();
      fetchActivities();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data);
    }
    setLoading(false);
  };

  const fetchBadges = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching badges:', error);
    } else {
      setBadges(data || []);
    }
  };

  const fetchActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data || []);
    }
  };

  const addActivity = async (
    activityType: string,
    activityId: string | null,
    activityTitle: string,
    pointsEarned: number
  ) => {
    if (!user) return;

    const { error } = await supabase.from('user_activities').insert({
      user_id: user.id,
      activity_type: activityType,
      activity_id: activityId,
      activity_title: activityTitle,
      points_earned: pointsEarned,
    });

    if (error) {
      console.error('Error adding activity:', error);
      toast.error('Erro ao registrar atividade');
    } else {
      await updateProgress(activityType, pointsEarned);
      fetchActivities();
    }
  };

  const updateProgress = async (activityType: string, points: number) => {
    if (!user || !progress) return;

    const updates: any = {
      total_points: progress.total_points + points,
      last_activity_date: new Date().toISOString().split('T')[0],
    };

    if (activityType === 'game_completed') {
      updates.games_completed = progress.games_completed + 1;
    } else if (activityType === 'ebook_read' || activityType === 'music_listened') {
      updates.ebooks_read = progress.ebooks_read + 1;
    } else if (activityType === 'coloring_completed') {
      updates.coloring_completed = progress.coloring_completed + 1;
    }

    updates.level = Math.floor(updates.total_points / 100) + 1;

    const { error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      setProgress({ ...progress, ...updates });
      checkBadges(updates);
    }
  };

  const checkBadges = async (updatedProgress: any) => {
    if (!user) return;

    const newBadges: string[] = [];

    if (updatedProgress.games_completed === 1) newBadges.push('first_game');
    if (updatedProgress.games_completed === 5) newBadges.push('games_5');
    if (updatedProgress.games_completed === 10) newBadges.push('games_10');
    if (updatedProgress.ebooks_read === 1) newBadges.push('first_ebook');
    if (updatedProgress.ebooks_read === 5) newBadges.push('ebooks_5');
    if (updatedProgress.coloring_completed === 1) newBadges.push('first_coloring');
    if (updatedProgress.coloring_completed === 5) newBadges.push('coloring_5');
    if (updatedProgress.coloring_completed === 10) newBadges.push('coloring_10');
    if (updatedProgress.coloring_completed === 25) newBadges.push('coloring_master');
    if (updatedProgress.level === 5) newBadges.push('level_5');
    if (updatedProgress.level === 10) newBadges.push('level_10');

    for (const badgeType of newBadges) {
      const { error } = await supabase.from('user_badges').insert({
        user_id: user.id,
        badge_type: badgeType,
      });

      if (!error) {
        toast.success(`🎉 Nova conquista: ${getBadgeName(badgeType)}!`);
        fetchBadges();
      }
    }
  };

  const toggleFavorite = async (contentType: string, contentId: string) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id);

      if (!error) {
        toast.success('Removido dos favoritos');
      }
    } else {
      const { error } = await supabase.from('user_favorites').insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
      });

      if (!error) {
        toast.success('Adicionado aos favoritos');
      }
    }
  };

  return {
    progress,
    badges,
    activities,
    loading,
    addActivity,
    toggleFavorite,
    refreshProgress: fetchUserProgress,
  };
};

const getBadgeName = (badgeType: string): string => {
  const names: { [key: string]: string } = {
    first_game: 'Primeiro Jogo',
    games_5: '5 Jogos Completos',
    games_10: '10 Jogos Completos',
    first_ebook: 'Primeira Música',
    ebooks_5: '5 Músicas Ouvidas',
    first_coloring: 'Primeiro Desenho Colorido',
    coloring_5: '5 Desenhos Coloridos',
    coloring_10: '10 Desenhos Coloridos',
    coloring_master: 'Mestre Artista (25)',
    level_5: 'Nível 5',
    level_10: 'Nível 10',
  };
  return names[badgeType] || badgeType;
};
