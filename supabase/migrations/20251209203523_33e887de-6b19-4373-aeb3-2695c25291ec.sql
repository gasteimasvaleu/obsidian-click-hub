-- Adicionar coluna content_type para distinguir tipos de conteúdo
ALTER TABLE ebooks 
ADD COLUMN content_type TEXT NOT NULL DEFAULT 'ebook';

-- Adicionar coluna video_url para links externos de vídeo (YouTube, Vimeo, etc.)
ALTER TABLE ebooks 
ADD COLUMN video_url TEXT;

-- Atualizar registros existentes baseado no formato
UPDATE ebooks 
SET content_type = 'audiobook' 
WHERE LOWER(format) LIKE '%mp3%' 
   OR LOWER(format) LIKE '%m4a%' 
   OR LOWER(format) LIKE '%audio%';

-- Comentário para documentação
COMMENT ON COLUMN ebooks.content_type IS 'Tipo de conteúdo: ebook, audiobook, video';
COMMENT ON COLUMN ebooks.video_url IS 'URL externa de vídeo (YouTube, Vimeo, etc.)';