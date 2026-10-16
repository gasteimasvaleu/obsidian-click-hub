import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Premium status is decided only by the server: the app asks `rc-sync`
 * (which checks RevenueCat with secret keys) and then reads the user's own
 * subscriber row. The device's RevenueCat customer info is never trusted,
 * because a store account shared between app accounts would unlock everyone.
 */
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
      const { syncSubscriptionAfterLogin } = await import('@/lib/revenuecat');
      await syncSubscriptionAfterLogin(user.id, user.email ?? '');
      const { data } = await supabase
        .from('subscribers')
        .select('subscription_status, subscription_expires_at')
        .eq('user_id', user.id);
      active = (data || []).some(
        (s) => s.subscription_status === 'active' &&
          (!s.subscription_expires_at || new Date(s.subscription_expires_at) > new Date())
      );
    } catch (e) {
      console.error('useSubscription error', e);
    }
    setIsActive(active);
    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => { refresh(); }, [refresh]);

  return { isActive, loading, refresh };
}
