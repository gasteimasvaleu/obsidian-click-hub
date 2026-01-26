-- Criar tabela de carrosseis
CREATE TABLE IF NOT EXISTS public.platform_carousels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  available boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.platform_carousels ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer pessoa pode ver carrosseis disponíveis
CREATE POLICY "Anyone can view available carousels"
ON public.platform_carousels FOR SELECT
USING (available = true);

-- Policy: Admins podem gerenciar
CREATE POLICY "Admins can manage carousels"
ON public.platform_carousels FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_platform_carousels_updated_at
  BEFORE UPDATE ON public.platform_carousels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar carrossel para o curso Contos Bíblicos existente
INSERT INTO public.platform_carousels (course_id, display_order, available)
SELECT id, display_order, true
FROM public.courses 
WHERE title LIKE '%Contos Bíblicos%';