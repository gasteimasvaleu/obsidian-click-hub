
-- ==============================================
-- Tabela: coloring_drawings (desenhos pré-criados)
-- ==============================================
CREATE TABLE public.coloring_drawings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'personagens',
  difficulty TEXT NOT NULL DEFAULT 'facil',
  display_order INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coloring_drawings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coloring drawings"
  ON public.coloring_drawings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view available coloring drawings"
  ON public.coloring_drawings FOR SELECT
  USING (available = true);

-- ==============================================
-- Tabela: user_coloring_creations (criações do usuário)
-- ==============================================
CREATE TABLE public.user_coloring_creations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  drawing_id UUID REFERENCES public.coloring_drawings(id) ON DELETE SET NULL,
  original_image_url TEXT NOT NULL,
  colored_image_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Minha Criação',
  is_from_photo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_coloring_creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coloring creations"
  ON public.user_coloring_creations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coloring creations"
  ON public.user_coloring_creations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own coloring creations"
  ON public.user_coloring_creations FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coloring creations"
  ON public.user_coloring_creations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ==============================================
-- Storage Bucket: coloring
-- ==============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('coloring', 'coloring', true);

-- Storage policies
CREATE POLICY "Anyone can view coloring files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'coloring');

CREATE POLICY "Admins can upload coloring drawings"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'coloring' AND (storage.foldername(name))[1] = 'drawings' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete coloring drawings"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'coloring' AND (storage.foldername(name))[1] = 'drawings' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can upload own coloring creations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'coloring' AND (storage.foldername(name))[1] = 'creations' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own coloring creations"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'coloring' AND (storage.foldername(name))[1] = 'creations' AND auth.uid() IS NOT NULL);
