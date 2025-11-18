-- Corrigir testamentos e categorias dos livros bíblicos
-- Baseado na ordem canônica dos livros (book_order)

-- ============================================
-- ATUALIZAR TESTAMENTOS
-- ============================================

-- Antigo Testamento (livros 1-39)
UPDATE bible_books 
SET testament = 'antigo'
WHERE book_order <= 39;

-- Novo Testamento (livros 40-66)
UPDATE bible_books 
SET testament = 'novo'
WHERE book_order > 39;

-- ============================================
-- CATEGORIAS DO ANTIGO TESTAMENTO
-- ============================================

-- Pentateuco (Gênesis a Deuteronômio)
UPDATE bible_books 
SET category = 'pentateuco'
WHERE book_order BETWEEN 1 AND 5;

-- Livros Históricos (Josué a Ester)
UPDATE bible_books 
SET category = 'historicos'
WHERE book_order BETWEEN 6 AND 17;

-- Livros Poéticos (Jó a Cantares)
UPDATE bible_books 
SET category = 'poeticos'
WHERE book_order BETWEEN 18 AND 22;

-- Profetas Maiores (Isaías a Daniel)
UPDATE bible_books 
SET category = 'profetas_maiores'
WHERE book_order BETWEEN 23 AND 27;

-- Profetas Menores (Oséias a Malaquias)
UPDATE bible_books 
SET category = 'profetas_menores'
WHERE book_order BETWEEN 28 AND 39;

-- ============================================
-- CATEGORIAS DO NOVO TESTAMENTO
-- ============================================

-- Evangelhos (Mateus a João)
UPDATE bible_books 
SET category = 'evangelhos'
WHERE book_order BETWEEN 40 AND 43;

-- Livro Histórico (Atos)
UPDATE bible_books 
SET category = 'historico'
WHERE book_order = 44;

-- Cartas de Paulo (Romanos a Filemon)
UPDATE bible_books 
SET category = 'cartas_paulo'
WHERE book_order BETWEEN 45 AND 57;

-- Cartas Gerais (Hebreus a Judas)
UPDATE bible_books 
SET category = 'cartas_gerais'
WHERE book_order BETWEEN 58 AND 65;

-- Profético (Apocalipse)
UPDATE bible_books 
SET category = 'profetico'
WHERE book_order = 66;