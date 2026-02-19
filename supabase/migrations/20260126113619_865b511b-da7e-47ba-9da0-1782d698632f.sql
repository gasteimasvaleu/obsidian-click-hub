-- Create prayers table
CREATE TABLE public.prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  icon_name text NOT NULL DEFAULT 'heart',
  display_order integer NOT NULL DEFAULT 0,
  available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_favorite_prayers table
CREATE TABLE public.user_favorite_prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prayer_id uuid NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, prayer_id)
);

-- Enable RLS
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_prayers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayers
CREATE POLICY "Anyone can view available prayers"
ON public.prayers
FOR SELECT
USING (available = true);

CREATE POLICY "Admins can manage prayers"
ON public.prayers
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_favorite_prayers
CREATE POLICY "Users can manage own favorite prayers"
ON public.user_favorite_prayers
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_prayers_updated_at
BEFORE UPDATE ON public.prayers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial prayers data
INSERT INTO public.prayers (title, content, category, icon_name, display_order) VALUES
-- Família
('Oração pela Família', 'Querido Deus, abençoe minha família hoje e sempre. Proteja cada um de nós e nos mantenha unidos no amor. Amém.', 'familia', 'users', 1),
('Oração pelos Pais', 'Senhor, obrigado pelos meus pais. Abençoe-os com saúde, paz e alegria. Ajude-me a sempre honrá-los. Amém.', 'familia', 'users', 2),
('Oração pelos Irmãos', 'Pai do Céu, cuide dos meus irmãos. Que possamos sempre brincar juntos e nos amar. Amém.', 'familia', 'users', 3),
('Oração pelos Avós', 'Deus bondoso, abençoe meus avós com muita saúde e felicidade. Obrigado por todo amor que eles me dão. Amém.', 'familia', 'users', 4),

-- Saúde
('Oração pela Saúde', 'Pai Celestial, te peço saúde para mim e para todos que amo. Cura as doenças e nos dá força. Amém.', 'saude', 'heart', 1),
('Oração para Quando Estou Doente', 'Jesus, estou me sentindo mal. Por favor, me ajude a melhorar logo. Confio em Ti. Amém.', 'saude', 'heart', 2),
('Oração pela Cura de Alguém', 'Senhor, meu amigo está doente. Por favor, cuide dele e o faça ficar bom. Amém.', 'saude', 'heart', 3),

-- Proteção
('Oração de Proteção Diária', 'Deus, me proteja neste dia. Afaste todo mal e perigo de mim e da minha família. Amém.', 'protecao', 'shield', 1),
('Oração do Anjo da Guarda', 'Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, guarda, governa e ilumina. Amém.', 'protecao', 'shield', 2),
('Oração para Viagem', 'Senhor, proteja nossa viagem. Guie nosso caminho e nos leve em segurança ao destino. Amém.', 'protecao', 'shield', 3),

-- Escola
('Oração antes da Aula', 'Deus, me ajude a aprender coisas novas hoje. Abençoe meus professores e colegas. Amém.', 'escola', 'graduation-cap', 1),
('Oração para a Prova', 'Senhor, estou nervoso com a prova. Me ajude a lembrar do que estudei e a fazer o meu melhor. Amém.', 'escola', 'graduation-cap', 2),
('Oração pelos Professores', 'Pai, abençoe meus professores. Dê a eles paciência e sabedoria para nos ensinar. Amém.', 'escola', 'graduation-cap', 3),
('Oração pelos Colegas', 'Jesus, abençoe meus amigos da escola. Que possamos sempre nos ajudar e brincar juntos. Amém.', 'escola', 'graduation-cap', 4),

-- Gratidão
('Oração de Agradecimento', 'Obrigado, Senhor, por tudo que tenho: minha família, minha casa, minha comida. Sou muito abençoado! Amém.', 'gratidao', 'sparkles', 1),
('Obrigado pelo Dia', 'Deus, obrigado por mais um dia de vida. Obrigado pelo sol, pelos pássaros e por tudo de bom. Amém.', 'gratidao', 'sparkles', 2),
('Obrigado pela Natureza', 'Pai Criador, obrigado pelas flores, árvores, animais e pela natureza tão linda. Amém.', 'gratidao', 'sparkles', 3),

-- Amigos
('Oração pelos Amigos', 'Senhor, abençoe todos os meus amigos. Obrigado por cada um deles na minha vida. Amém.', 'amigos', 'heart-handshake', 1),
('Oração por um Amigo Triste', 'Jesus, meu amigo está triste. Por favor, console o coração dele e traga alegria. Amém.', 'amigos', 'heart-handshake', 2),
('Oração para Fazer Novos Amigos', 'Deus, me ajude a fazer novos amigos e a ser um bom amigo para todos. Amém.', 'amigos', 'heart-handshake', 3),

-- Noite
('Oração antes de Dormir', 'Pai do Céu, obrigado por este dia. Proteja meu sono e me dê lindos sonhos. Boa noite, Deus. Amém.', 'noite', 'moon', 1),
('Oração da Noite', 'Senhor, estou indo dormir. Cuide de mim e de toda minha família durante a noite. Amém.', 'noite', 'moon', 2),
('Oração contra Pesadelos', 'Jesus, afasta os pesadelos de mim. Enche meus sonhos de paz e alegria. Amém.', 'noite', 'moon', 3),

-- Manhã
('Oração ao Acordar', 'Bom dia, Deus! Obrigado por mais um dia. Me ajude a ser uma pessoa boa hoje. Amém.', 'manha', 'sun', 1),
('Oração do Novo Dia', 'Senhor, este é o dia que fizeste. Vou me alegrar e ser feliz nele. Abençoa minhas atividades. Amém.', 'manha', 'sun', 2),
('Oração para Começar Bem', 'Pai, que este dia seja cheio de coisas boas. Me guie em tudo que eu fizer. Amém.', 'manha', 'sun', 3),

-- Refeição
('Oração antes da Refeição', 'Senhor, abençoa este alimento que vamos receber. Obrigado por prover nossa comida. Amém.', 'refeicao', 'utensils-crossed', 1),
('Agradecimento pelo Alimento', 'Pai, obrigado pela comida na nossa mesa. Abençoa as mãos que a prepararam. Amém.', 'refeicao', 'utensils-crossed', 2),
('Oração do Lanche', 'Deus, obrigado por este lanchinho. Ele vai me dar energia para brincar e estudar. Amém.', 'refeicao', 'utensils-crossed', 3);