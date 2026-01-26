import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveHeroBanner } from "@/components/plataforma/ResponsiveHeroBanner";
import { LessonPlaylist } from "@/components/plataforma/LessonPlaylist";
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
}

interface ModuleLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  duration: number | null;
  display_order: number;
}

export default function ModulePage() {
  const { moduleId } = useParams();

  const { data: module, isLoading: loadingModule } = useQuery({
    queryKey: ["course_module", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_modules")
        .select("*")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      return data as CourseModule;
    },
    enabled: !!moduleId,
  });

  const { data: lessons, isLoading: loadingLessons } = useQuery({
    queryKey: ["module_lessons", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_lessons")
        .select("*")
        .eq("module_id", moduleId)
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as ModuleLesson[];
    },
    enabled: !!moduleId,
  });

  const isLoading = loadingModule || loadingLessons;

  if (isLoading) {
    return (
      <PlataformaLayout>
        <Skeleton className="w-full aspect-video" />
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </PlataformaLayout>
    );
  }

  if (!module) {
    return (
      <PlataformaLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Módulo não encontrado
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
      {/* Hero Banner */}
      <ResponsiveHeroBanner
        bannerDesktop={module.banner_desktop || undefined}
        bannerMobile={module.banner_mobile || undefined}
        title={module.title}
        description={module.description}
        aspectRatioDesktop={1440 / 730}
        aspectRatioMobile={300 / 580}
        bottomGradient
      />

      {/* Back button and lessons */}
      <div className="p-4 space-y-6">
        <Link to={`/plataforma/curso/${module.course_id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar para o Curso
          </Button>
        </Link>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Aulas do Módulo</h2>
          <LessonPlaylist
            items={(lessons || []).map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              thumbnail: lesson.thumbnail || undefined,
              duration: lesson.duration || undefined,
              linkTo: `/plataforma/aula/${lesson.id}`,
            }))}
            layout="horizontal"
          />
        </div>
      </div>
    </PlataformaLayout>
  );
}
