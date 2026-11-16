DROP POLICY IF EXISTS "Users insert own free views" ON public.free_lesson_views;
CREATE POLICY "Users insert own free views" ON public.free_lesson_views FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND (SELECT count(*) FROM public.free_lesson_views f WHERE f.user_id = auth.uid()) < 5
);