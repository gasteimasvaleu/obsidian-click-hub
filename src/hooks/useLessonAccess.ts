import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from './useSubscription';

export const FREE_LESSON_LIMIT = 3;

type Status = 'loading' | 'allowed' | 'blocked';

export function useLessonAccess(lessonId?: string) {
  const { user } = useAuth();
  const { isActive, loading: subLoading, refresh } = useSubscription();
  const [status, setStatus] = useState<Status>('loading');
  const [remaining, setRemaining] = useState<number | null>(null);

  const check = useCallback(async () => {
    if (!user || !lessonId || subLoading) return;
    if (isActive) { setStatus('allowed'); setRemaining(null); return; }
    setStatus('loading');
    const { data } = await supabase
      .from('free_lesson_views' as any)
      .select('lesson_id')
      .eq('user_id', user.id);
    const ids = ((data as any[]) || []).map((r) => r.lesson_id as string);
    if (ids.includes(lessonId)) {
      setRemaining(Math.max(0, FREE_LESSON_LIMIT - ids.length));
      setStatus('allowed');
      return;
    }
    if (ids.length >= FREE_LESSON_LIMIT) { setRemaining(0); setStatus('blocked'); return; }
    const { error } = await supabase
      .from('free_lesson_views' as any)
      .insert({ user_id: user.id, lesson_id: lessonId } as any);
    if (error) { setStatus('blocked'); return; }
    setRemaining(FREE_LESSON_LIMIT - ids.length - 1);
    setStatus('allowed');
  }, [user, lessonId, isActive, subLoading]);

  useEffect(() => { check(); }, [check]);

  return { status, remaining, isSubscriber: isActive, unlock: refresh };
}
