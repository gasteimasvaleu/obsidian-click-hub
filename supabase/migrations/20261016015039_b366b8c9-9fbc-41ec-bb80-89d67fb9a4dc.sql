CREATE OR REPLACE FUNCTION public.link_subscriber_user_id()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.email IS NOT NULL THEN
    SELECT u.id INTO NEW.user_id FROM auth.users u
    WHERE lower(u.email) = lower(NEW.email) LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER link_subscriber_user_id_trg
BEFORE INSERT OR UPDATE ON public.subscribers
FOR EACH ROW EXECUTE FUNCTION public.link_subscriber_user_id();

UPDATE public.subscribers s SET user_id = u.id
FROM auth.users u
WHERE s.user_id IS NULL AND lower(u.email) = lower(s.email);