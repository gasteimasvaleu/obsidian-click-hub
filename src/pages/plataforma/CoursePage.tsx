import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import cursoTopoF98a from "@/assets/curso_topo_f98a.png.asset.json";
import cursoTopoBfba from "@/assets/curso_topo_bfba.png.asset.json";
import cursoTopoB4ab from "@/assets/curso_topo_b4ab.png.asset.json";
import cursoTopoFbb8 from "@/assets/curso_topo_fbb8.png.asset.json";

import cursoTopoE0ef from "@/assets/curso_topo_e0ef.png.asset.json";
const HERO_OVERRIDES: Record<string, string> = {
  "f98a734c-e35f-4bc8-97fb-9d51c7c702c1": cursoTopoF98a.url,
  "bfbaefa8-f0bf-46cf-9032-eeb1b6d356f9": cursoTopoBfba.url,
  "b4ab8042-ff4f-4384-9b9a-23a1e6400cb8": cursoTopoB4ab.url,
  "fbb80bfa-eaa8-4aa0-8b77-8c1c49d153ca": cursoTopoFbb8.url,
  "e0efe516-48c2-4135-90ad-1015ecfa6b38": cursoTopoE0ef.url,
};
import { ResponsiveHeroBanner } from "@/components/plataforma/ResponsiveHeroBanner";
import { ModulePlaylist } from "@/components/plataforma/ModulePlaylist";
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { BackArrowButton } from "@/components/plataforma/BackArrowButton";
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

  const heroOverride = HERO_OVERRIDES[course.id];

  return (
    <PlataformaLayout>
      {/* Hero Banner */}
      <ResponsiveHeroBanner
        bannerDesktop={heroOverride || course.page_image_desktop || course.banner_desktop || undefined}
        bannerMobile={heroOverride || course.page_image_desktop || course.banner_desktop || course.page_image_mobile || course.banner_mobile || undefined}
        title={course.title}
        description={course.description}
        aspectRatioDesktop={heroOverride ? 1672 / 941 : 1440 / 730}
        aspectRatioMobile={heroOverride ? 1672 / 941 : 1440 / 730}
        overlay={false}
        card
      />
      <SectionHeader
        title={course.title}
        description={course.description || undefined}
        className="mb-0 px-4"
      />

      {/* Back button and modules */}
      <div className="p-4 space-y-6">
        <BackArrowButton to="/plataforma" label="Voltar para Plataforma" />

        <div className="space-y-4">
          <SectionHeader title="Módulos do Curso" className="mb-0" />
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
