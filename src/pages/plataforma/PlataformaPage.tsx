import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveHeroBanner } from "@/components/plataforma/ResponsiveHeroBanner";
import { CourseCarousel } from "@/components/plataforma/CourseCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";

interface Course {
  id: string;
  title: string;
  description: string;
  banner_desktop: string | null;
  banner_mobile: string | null;
  thumbnail: string | null;
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

interface PlatformSettings {
  hero_banner_desktop: string | null;
  hero_banner_mobile: string | null;
  hero_video_desktop: string | null;
  hero_video_mobile: string | null;
  hero_use_video: string;
  hero_title: string;
  hero_description: string;
  carousel_title: string;
  carousel_description: string;
}

interface PlatformCarousel {
  id: string;
  course_id: string;
  title: string | null;
  description: string | null;
  display_order: number;
  available: boolean;
  course: Course | null;
}

export default function PlataformaPage() {
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["platform_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*");
      if (error) throw error;
      return data.reduce((acc, item) => {
        acc[item.key as keyof PlatformSettings] = item.value;
        return acc;
      }, {} as PlatformSettings);
    },
  });

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

  const { data: carousels, isLoading: loadingCarousels } = useQuery({
    queryKey: ["platform_carousels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_carousels")
        .select(`
          *,
          course:courses(id, title, description, thumbnail, banner_desktop, banner_mobile, display_order)
        `)
        .eq("available", true)
        .order("display_order");
      if (error) throw error;
      return data as PlatformCarousel[];
    },
  });

  const isLoading = loadingSettings || loadingCourses || loadingModules || loadingCarousels;

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
    <PlataformaLayout>
      {/* Hero Banner */}
      <ResponsiveHeroBanner
        bannerDesktop={settings?.hero_banner_desktop || undefined}
        bannerMobile={settings?.hero_banner_mobile || undefined}
        videoDesktop={settings?.hero_video_desktop || undefined}
        videoMobile={settings?.hero_video_mobile || undefined}
        useVideo={settings?.hero_use_video === "true"}
        title={settings?.hero_title || ""}
        description={settings?.hero_description || ""}
        aspectRatioDesktop={2560 / 1440}
        aspectRatioMobile={1080 / 1920}
      />

      <div className="py-8 space-y-10">
        {/* Courses Carousel */}
        <CourseCarousel
          title={settings?.carousel_title || "Cursos"}
          description={settings?.carousel_description || ""}
          items={courses.map((course) => ({
            id: course.id,
            title: course.title,
            thumbnail: course.thumbnail || undefined,
            linkTo: `/plataforma/curso/${course.id}`,
          }))}
          className="px-4"
        />

        {/* Custom Carousels - Modules from selected courses */}
        {carousels?.map((carousel) => {
          const courseModules = modulesByCourse?.[carousel.course_id] || [];
          if (courseModules.length === 0) return null;

          return (
            <CourseCarousel
              key={carousel.id}
              title={carousel.title || carousel.course?.title || ""}
              description={carousel.description || carousel.course?.description || ""}
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
    </PlataformaLayout>
  );
}
