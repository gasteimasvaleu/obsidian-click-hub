import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveHeroBanner } from "@/components/plataforma/ResponsiveHeroBanner";
import { ModulePlaylist } from "@/components/plataforma/ModulePlaylist";
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  page_image_desktop: string | null;
  page_image_mobile: string | null;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  thumbnail: string | null;
  display_order: number;
}

export default function CoursePage() {
  const { courseId } = useParams();

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });

  const { data: modules, isLoading: loadingModules } = useQuery({
    queryKey: ["course_modules", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as CourseModule[];
    },
    enabled: !!courseId,
  });

  const isLoading = loadingCourse || loadingModules;

  if (isLoading) {
    return (
      <PlataformaLayout>
        <Skeleton className="w-full aspect-video" />
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </PlataformaLayout>
    );
  }

  if (!course) {
    return (
      <PlataformaLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Curso não encontrado
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
        bannerDesktop={course.page_image_desktop || course.banner_desktop || undefined}
        bannerMobile={course.page_image_mobile || course.banner_mobile || undefined}
        title={course.title}
        description={course.description}
        aspectRatioDesktop={1440 / 730}
        aspectRatioMobile={1080 / 1920}
        bottomGradient
      />

      {/* Back button and modules */}
      <div className="p-4 space-y-6">
        <Link to="/plataforma">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar para Plataforma
          </Button>
        </Link>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Módulos do Curso</h2>
          <ModulePlaylist
            items={(modules || []).map((module) => ({
              id: module.id,
              title: module.title,
              description: module.description,
              thumbnail: module.thumbnail || undefined,
              linkTo: `/plataforma/modulo/${module.id}`,
            }))}
          />
        </div>
      </div>
    </PlataformaLayout>
  );
}
