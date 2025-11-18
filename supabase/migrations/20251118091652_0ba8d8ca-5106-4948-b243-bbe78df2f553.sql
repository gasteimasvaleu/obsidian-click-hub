-- Corrigir função get_random_verse com search_path seguro
CREATE OR REPLACE FUNCTION get_random_verse()
RETURNS TABLE (
  text TEXT,
  book_name TEXT,
  chapter INTEGER,
  verse_number INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bv.text,
    bb.name as book_name,
    bc.chapter_number as chapter,
    bv.verse_number
  FROM bible_verses bv
  JOIN bible_chapters bc ON bv.chapter_id = bc.id
  JOIN bible_books bb ON bc.book_id = bb.id
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$;