import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useSubscription() {
  const { user, isAdmin } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setIsActive(false); setLoading(false); return; }
    if (isAdmin) { setIsActive(true); setLoading(false); return; }
    setLoading(true);
    let active = false;
    try {
      const { data } = await supabase
        .from('subscribers')
        .select('subscription_status, subscription_expires_at')
        .or(`user_id.eq.${user.id}${user.email ? `,email.eq.${user.email}` : ''}`);
      active = (data || []).some(
        (s) => s.subscription_status === 'active' &&
          (!s.subscription_expires_at || new Date(s.subscription_expires_at) > new Date())
      );
      if (!active) {
        const { checkSubscriptionStatus } = await import('@/lib/revenuecat');
        active = (await checkSubscriptionStatus()).isActive;
      }
    } catch (e) {
      console.error('useSubscription error', e);
    }
    setIsActive(active);
    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => { refresh(); }, [refresh]);

  return { isActive, loading, refresh };
}
