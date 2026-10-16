DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can upsert own subscription" ON public.subscribers;

CREATE OR REPLACE FUNCTION public.update_my_whatsapp(_optin boolean DEFAULT NULL, _phone text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _email text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT email INTO _email FROM auth.users WHERE id = _uid;
  IF _phone IS NOT NULL AND (length(_phone) > 20 OR _phone !~ '^[0-9]+$') THEN RAISE EXCEPTION 'invalid phone'; END IF;
  UPDATE subscribers SET
    whatsapp_optin = COALESCE(_optin, whatsapp_optin),
    whatsapp_optin_at = CASE WHEN _optin IS NOT NULL THEN now() ELSE whatsapp_optin_at END,
    phone = COALESCE(_phone, phone),
    updated_at = now()
  WHERE subscription_status = 'active' AND (user_id = _uid OR (_email IS NOT NULL AND lower(email) = lower(_email)));
END; $$;
REVOKE ALL ON FUNCTION public.update_my_whatsapp(boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_whatsapp(boolean, text) TO authenticated;