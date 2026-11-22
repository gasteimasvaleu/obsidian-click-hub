CREATE TABLE public.daily_liturgy (
  date date PRIMARY KEY,
  title text NOT NULL,
  color text NOT NULL DEFAULT 'Verde',
  readings jsonb NOT NULL DEFAULT '{}'::jsonb,
  reflection text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_liturgy TO authenticated;
GRANT ALL ON public.daily_liturgy TO service_role;
ALTER TABLE public.daily_liturgy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "liturgy readable by signed in" ON public.daily_liturgy FOR SELECT TO authenticated USING (true);