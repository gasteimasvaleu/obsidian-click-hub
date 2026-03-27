CREATE OR REPLACE FUNCTION public.expire_overdue_subscriptions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE subscribers
  SET subscription_status = 'expired',
      updated_at = now()
  WHERE subscription_status = 'active'
    AND subscription_expires_at IS NOT NULL
    AND subscription_expires_at < now()
    AND NOT EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = subscribers.user_id
        AND user_roles.role = 'admin'
    );
$$;