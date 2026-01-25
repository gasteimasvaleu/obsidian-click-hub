-- Create platform_settings table
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read platform settings
CREATE POLICY "Anyone can read platform settings"
ON public.platform_settings FOR SELECT USING (true);

-- Admins can manage platform settings
CREATE POLICY "Admins can manage platform settings"
ON public.platform_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('hero_banner_desktop', NULL),
  ('hero_banner_mobile', NULL),
  ('hero_video_desktop', NULL),
  ('hero_video_mobile', NULL),
  ('hero_use_video', 'false'),
  ('hero_title', 'BíbliaToonKIDS – A Bíblia Ganha Vida para as Crianças e Pais!'),
  ('hero_description', 'BíbliaToonKIDS é uma plataforma cristã para crianças com animações bíblicas em 3D, músicas originais, vídeos interativos, PDFs para colorir e materiais exclusivos para os pais. Uma forma divertida e profunda de ensinar a Palavra de Deus desde cedo!'),
  ('carousel_title', 'Explore o Mundo Encantado da BíbliaToon Kids!'),
  ('carousel_description', 'Conheça nossos produtos exclusivos criados para ensinar a Palavra de Deus de forma divertida e inesquecível! Navegue pelo carrossel e descubra animações em 3D, livros digitais ilustrados, jogos bíblicos, músicas infantis, atividades para colorir e muito mais. Tudo com linguagem acessível, visual encantador e valores cristãos em cada detalhe. Ideal para pais, escolas e ministérios infantis que querem plantar fé e propósito no coração das crianças!');