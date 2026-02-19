-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_desktop TEXT,
  banner_mobile TEXT,
  thumbnail TEXT,
  video_desktop TEXT,
  video_mobile TEXT,
  use_video BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_modules table
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_desktop TEXT,
  banner_mobile TEXT,
  thumbnail TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create module_lessons table
CREATE TABLE public.module_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  video_url TEXT,
  video_source TEXT DEFAULT 'upload' CHECK (video_source IN ('upload', 'external')),
  external_content_url TEXT,
  duration INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_materials table
CREATE TABLE public.lesson_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.module_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view available courses"
ON public.courses FOR SELECT
USING (available = true);

CREATE POLICY "Admins can manage courses"
ON public.courses FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for course_modules
CREATE POLICY "Anyone can view available modules"
ON public.course_modules FOR SELECT
USING (available = true);

CREATE POLICY "Admins can manage modules"
ON public.course_modules FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for module_lessons
CREATE POLICY "Anyone can view available lessons"
ON public.module_lessons FOR SELECT
USING (available = true);

CREATE POLICY "Admins can manage lessons"
ON public.module_lessons FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for lesson_materials
CREATE POLICY "Anyone can view materials of available lessons"
ON public.lesson_materials FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.module_lessons ml
    WHERE ml.id = lesson_id AND ml.available = true
  )
);

CREATE POLICY "Admins can manage materials"
ON public.lesson_materials FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
BEFORE UPDATE ON public.course_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_lessons_updated_at
BEFORE UPDATE ON public.module_lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for plataforma
INSERT INTO storage.buckets (id, name, public)
VALUES ('plataforma', 'plataforma', true);

-- Storage policies for plataforma bucket
CREATE POLICY "Anyone can view plataforma files"
ON storage.objects FOR SELECT
USING (bucket_id = 'plataforma');

CREATE POLICY "Admins can upload plataforma files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plataforma' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plataforma files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'plataforma' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plataforma files"
ON storage.objects FOR DELETE
USING (bucket_id = 'plataforma' AND has_role(auth.uid(), 'admin'));