-- Add duration field for audiobooks
ALTER TABLE public.ebooks 
ADD COLUMN duration integer;

COMMENT ON COLUMN public.ebooks.duration IS 'Duration in minutes for audiobooks';