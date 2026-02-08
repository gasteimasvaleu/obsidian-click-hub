
-- Tabela de posts da comunidade
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read posts"
  ON public.community_posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins can delete posts"
  ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Trigger updated_at
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de comentarios
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read comments"
  ON public.community_comments FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create own comments"
  ON public.community_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins can delete comments"
  ON public.community_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Tabela de likes
CREATE TABLE public.community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read likes"
  ON public.community_likes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add own likes"
  ON public.community_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON public.community_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Trigger para atualizar likes_count automaticamente
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.community_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Storage bucket para imagens da comunidade
INSERT INTO storage.buckets (id, name, public) VALUES ('community', 'community', true);

CREATE POLICY "Authenticated users can upload community images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community');

CREATE POLICY "Anyone can view community images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community');

CREATE POLICY "Users can delete own community images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);
