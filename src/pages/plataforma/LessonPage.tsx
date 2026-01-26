import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LessonPlayer } from "@/components/plataforma/LessonPlayer";
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  video_url: string | null;
  video_source: string | null;
  external_content_url: string | null;
  duration: number | null;
  display_order: number;
}

interface LessonMaterial {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  display_order: number;
}

export default function LessonPage() {
  const { lessonId } = useParams();

  const { data: lesson, isLoading: loadingLesson } = useQuery({
    queryKey: ["module_lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      if (error) throw error;
      return data as ModuleLesson;
    },
    enabled: !!lessonId,
  });

  const { data: materials } = useQuery({
    queryKey: ["lesson_materials", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_materials")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("display_order");
      if (error) throw error;
      return data as LessonMaterial[];
    },
    enabled: !!lessonId,
  });

  const { data: relatedLessons } = useQuery({
    queryKey: ["related_lessons", lesson?.module_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_lessons")
        .select("*")
        .eq("module_id", lesson!.module_id)
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as ModuleLesson[];
    },
    enabled: !!lesson?.module_id,
  });

  if (loadingLesson) {
    return (
      <PlataformaLayout>
        <div className="p-4">
          <Skeleton className="w-full aspect-video mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </PlataformaLayout>
    );
  }

  if (!lesson) {
    return (
      <PlataformaLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Aula não encontrada
          </h1>
          <Link to="/plataforma">
            <Button variant="outline">Voltar para Plataforma</Button>
          </Link>
        </div>
      </PlataformaLayout>
    );
  }

  return (
    <PlataformaLayout>
      {/* Back button */}
      <div className="p-4">
        <Link to={`/plataforma/modulo/${lesson.module_id}`}>
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ChevronLeft className="h-4 w-4" />
            Voltar para o Módulo
          </Button>
        </Link>

        <LessonPlayer
          videoUrl={lesson.video_url || undefined}
          videoSource={(lesson.video_source as "upload" | "external") || "upload"}
          title={lesson.title}
          description={lesson.description}
          externalContentUrl={lesson.external_content_url || undefined}
          materials={(materials || []).map((m) => ({
            id: m.id,
            title: m.title,
            file_url: m.file_url,
            file_type: m.file_type,
            file_size: m.file_size || undefined,
          }))}
          relatedLessons={(relatedLessons || [])
            .filter((l) => l.id !== lessonId)
            .map((l) => ({
              id: l.id,
              title: l.title,
              description: l.description,
              thumbnail: l.thumbnail || undefined,
              duration: l.duration || undefined,
              linkTo: `/plataforma/aula/${l.id}`,
            }))}
          currentLessonId={lessonId || ""}
        />
      </div>
    </PlataformaLayout>
  );
}
