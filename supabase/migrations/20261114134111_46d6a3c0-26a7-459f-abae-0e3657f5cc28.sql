CREATE TABLE public.bible_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Novo estudo',
  audience text NOT NULL DEFAULT 'kids',
  source_type text NOT NULL DEFAULT 'free',
  source_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_studies TO authenticated;
GRANT ALL ON public.bible_studies TO service_role;
ALTER TABLE public.bible_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own studies" ON public.bible_studies FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_bible_studies_updated_at BEFORE UPDATE ON public.bible_studies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX bible_studies_user_idx ON public.bible_studies(user_id, updated_at DESC);

CREATE TABLE public.bible_study_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id uuid NOT NULL REFERENCES public.bible_studies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.bible_study_messages TO authenticated;
GRANT ALL ON public.bible_study_messages TO service_role;
ALTER TABLE public.bible_study_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own study messages" ON public.bible_study_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.bible_studies s WHERE s.id = study_id AND s.user_id = auth.uid()));
CREATE INDEX bible_study_messages_study_idx ON public.bible_study_messages(study_id, created_at);