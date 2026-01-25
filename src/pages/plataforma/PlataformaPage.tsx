import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveHeroBanner } from "@/components/plataforma/ResponsiveHeroBanner";
import { CourseCarousel } from "@/components/plataforma/CourseCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  video_desktop: string | null;
  video_mobile: string | null;
  thumbnail: string | null;
  use_video: boolean | null;
  display_order: number;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  display_order: number;
}

export default function PlataformaPage() {
  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: modules, isLoading: loadingModules } = useQuery({
    queryKey: ["course_modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_modules")
        .select("*")
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as CourseModule[];
    },
  });

  const isLoading = loadingCourses || loadingModules;

  // Get the first course for the hero banner
  const heroCourse = courses?.[0];

  // Group modules by course
  const modulesByCourse = modules?.reduce((acc, module) => {
    if (!acc[module.course_id]) {
      acc[module.course_id] = [];
    }
    acc[module.course_id].push(module);
    return acc;
  }, {} as Record<string, CourseModule[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <Skeleton className="w-full aspect-video" />
        <div className="p-4 space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-40 h-72 flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-24 px-4">
        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Plataforma de Cursos
        </h1>
        <p className="text-muted-foreground text-center">
          Nenhum curso disponível no momento. Volte em breve!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Banner */}
      <ResponsiveHeroBanner
        bannerDesktop={heroCourse?.banner_desktop || undefined}
        bannerMobile={heroCourse?.banner_mobile || undefined}
        videoDesktop={heroCourse?.video_desktop || undefined}
        videoMobile={heroCourse?.video_mobile || undefined}
        useVideo={heroCourse?.use_video || false}
        title="BíbliaToonKIDS – A Bíblia Ganha Vida para as Crianças e Pais!"
        description="BíbliaToonKIDS é uma plataforma cristã para crianças com animações bíblicas em 3D, músicas originais, vídeos interativos, PDFs para colorir e materiais exclusivos para os pais. Uma forma divertida e profunda de ensinar a Palavra de Deus desde cedo!"
        aspectRatioDesktop={2560 / 1440}
        aspectRatioMobile={1080 / 1920}
      />

      <div className="py-8 space-y-10">
        {/* Courses Carousel */}
        <CourseCarousel
          title="Cursos Disponíveis"
          description="Escolha um curso para começar sua jornada"
          items={courses.map((course) => ({
            id: course.id,
            title: course.title,
            thumbnail: course.thumbnail || undefined,
            linkTo: `/plataforma/curso/${course.id}`,
          }))}
          className="px-4"
        />

        {/* Modules for each course */}
        {courses.map((course) => {
          const courseModules = modulesByCourse?.[course.id] || [];
          if (courseModules.length === 0) return null;

          return (
            <CourseCarousel
              key={course.id}
              title={course.title}
              description={course.description}
              items={courseModules.map((module) => ({
                id: module.id,
                title: module.title,
                thumbnail: module.thumbnail || undefined,
                linkTo: `/plataforma/modulo/${module.id}`,
              }))}
              className="px-4"
            />
          );
        })}
      </div>
    </div>
  );
}
