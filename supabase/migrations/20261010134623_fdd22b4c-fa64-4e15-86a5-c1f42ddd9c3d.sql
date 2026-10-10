CREATE TABLE public.free_lesson_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT ON public.free_lesson_views TO authenticated;
GRANT ALL ON public.free_lesson_views TO service_role;
ALTER TABLE public.free_lesson_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own free views" ON public.free_lesson_views FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own free views" ON public.free_lesson_views FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND (SELECT count(*) FROM public.free_lesson_views f WHERE f.user_id = auth.uid()) < 3
);