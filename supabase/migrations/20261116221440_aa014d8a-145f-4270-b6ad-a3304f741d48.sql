CREATE TABLE public.rosary_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, mystery_set text NOT NULL, completed_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.rosary_sessions TO authenticated;
GRANT ALL ON public.rosary_sessions TO service_role;
ALTER TABLE public.rosary_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rosary select" ON public.rosary_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own rosary insert" ON public.rosary_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX rosary_sessions_user_idx ON public.rosary_sessions(user_id, completed_at DESC);