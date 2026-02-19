-- ========================================
-- FASE 1: ESTRUTURA DO BANCO DE DADOS
-- Bíblia Interativa + Devocional Diário
-- ========================================

-- 1.1 Criar Tabelas da Bíblia

-- bible_books (66 livros)
CREATE TABLE bible_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbrev TEXT NOT NULL,
  testament TEXT NOT NULL,
  book_order INTEGER NOT NULL,
  chapters_count INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bible_books_testament ON bible_books(testament);
CREATE INDEX idx_bible_books_order ON bible_books(book_order);

-- bible_chapters (~1.189 capítulos)
CREATE TABLE bible_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES bible_books(id) ON DELETE CASCADE NOT NULL,
  chapter_number INTEGER NOT NULL,
  verses_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(book_id, chapter_number)
);

CREATE INDEX idx_bible_chapters_book ON bible_chapters(book_id);

-- bible_verses (~31.102 versículos)
CREATE TABLE bible_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES bible_chapters(id) ON DELETE CASCADE NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(chapter_id, verse_number)
);

CREATE INDEX idx_bible_verses_chapter ON bible_verses(chapter_id);
CREATE INDEX idx_bible_verses_text ON bible_verses USING gin(to_tsvector('portuguese', text));

-- 1.2 Criar Tabelas de Interação do Usuário

-- user_favorite_verses (Versículos favoritos)
CREATE TABLE user_favorite_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verse_id UUID REFERENCES bible_verses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

CREATE INDEX idx_favorite_verses_user ON user_favorite_verses(user_id);

-- user_verse_notes (Notas em versículos)
CREATE TABLE user_verse_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verse_id UUID REFERENCES bible_verses(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_verse_notes_user ON user_verse_notes(user_id);
CREATE INDEX idx_verse_notes_verse ON user_verse_notes(verse_id);

-- user_reading_history (Histórico de leitura)
CREATE TABLE user_reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chapter_id UUID REFERENCES bible_chapters(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_reading_history_user ON user_reading_history(user_id);

-- 1.3 Criar Tabelas do Devocional

-- daily_devotionals (Devocionais diários)
CREATE TABLE daily_devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,
  verse_text TEXT NOT NULL,
  introduction TEXT NOT NULL,
  reflection TEXT NOT NULL,
  question TEXT NOT NULL,
  practical_applications TEXT NOT NULL,
  prayer TEXT NOT NULL,
  devotional_date DATE NOT NULL UNIQUE,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_devotionals_date ON daily_devotionals(devotional_date);

-- user_devotional_progress (Progresso nos devocionais)
CREATE TABLE user_devotional_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  devotional_id UUID REFERENCES daily_devotionals(id) ON DELETE CASCADE NOT NULL,
  marked_as_read BOOLEAN DEFAULT false,
  user_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, devotional_id)
);

CREATE INDEX idx_devotional_progress_user ON user_devotional_progress(user_id);

-- 1.4 Atualizar user_progress

ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS bible_chapters_read INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS devotionals_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_verses_count INTEGER DEFAULT 0;

-- 1.5 Criar Triggers

CREATE TRIGGER update_verse_notes_updated_at
  BEFORE UPDATE ON user_verse_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotionals_updated_at
  BEFORE UPDATE ON daily_devotionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devotional_progress_updated_at
  BEFORE UPDATE ON user_devotional_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1.6 Configurar RLS Policies

-- bible_books: Leitura pública
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bible books" 
  ON bible_books FOR SELECT USING (true);

-- bible_chapters: Leitura pública
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bible chapters" 
  ON bible_chapters FOR SELECT USING (true);

-- bible_verses: Leitura pública
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bible verses" 
  ON bible_verses FOR SELECT USING (true);

-- user_favorite_verses: Usuários gerenciam seus favoritos
ALTER TABLE user_favorite_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorite verses" 
  ON user_favorite_verses FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_verse_notes: Usuários gerenciam suas notas
ALTER TABLE user_verse_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own verse notes" 
  ON user_verse_notes FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_reading_history: Usuários gerenciam seu histórico
ALTER TABLE user_reading_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reading history" 
  ON user_reading_history FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- daily_devotionals: Leitura pública dos disponíveis, admin gerencia
ALTER TABLE daily_devotionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read available devotionals" 
  ON daily_devotionals FOR SELECT 
  USING (available = true);
CREATE POLICY "Admins manage devotionals" 
  ON daily_devotionals FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

-- user_devotional_progress: Usuários gerenciam seu progresso
ALTER TABLE user_devotional_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own devotional progress" 
  ON user_devotional_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);