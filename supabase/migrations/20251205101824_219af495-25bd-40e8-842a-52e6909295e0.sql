-- Add theological_comment column to bible_verses table
ALTER TABLE public.bible_verses 
ADD COLUMN theological_comment TEXT DEFAULT NULL;