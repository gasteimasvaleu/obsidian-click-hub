-- Add page image columns to courses table for individual course pages
ALTER TABLE public.courses
ADD COLUMN page_image_desktop TEXT,
ADD COLUMN page_image_mobile TEXT;