import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaUploader } from "@/components/plataforma/MediaUploader";
import { Loader2, Save, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformSettings {
  hero_banner_desktop: string | null;
  hero_banner_mobile: string | null;
  hero_video_desktop: string | null;
  hero_video_mobile: string | null;
  hero_use_video: string;
  hero_title: string;
  hero_description: string;
}

const defaultSettings: PlatformSettings = {
  hero_banner_desktop: null,
  hero_banner_mobile: null,
  hero_video_desktop: null,
  hero_video_mobile: null,
  hero_use_video: "false",
  hero_title: "",
  hero_description: "",
};

export default function PlatformSettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PlatformSettings>(defaultSettings);

  const { data: settings, isLoading } = useQuery({
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

  useEffect(() => {
    if (settings) {
      setFormData({
        ...defaultSettings,
        ...settings,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: PlatformSettings) => {
      const updates = Object.entries(data).map(([key, value]) => ({
        key,
        value: value ?? null,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("platform_settings")
          .update({ value: update.value })
          .eq("key", update.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform_settings"] });
      toast({
        title: "Configurações salvas!",
        description: "As configurações da página Plataforma foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Configurações da Plataforma
            </h1>
            <p className="text-muted-foreground">
              Configure o header e os textos da página principal da plataforma
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Header da Página</CardTitle>
              <CardDescription>
                Configure o banner ou vídeo exibido no topo da página /plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toggle Video/Image */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-video"
                  checked={formData.hero_use_video === "true"}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hero_use_video: checked ? "true" : "false" })
                  }
                />
                <Label htmlFor="use-video">Usar vídeo em vez de imagem</Label>
              </div>

              {formData.hero_use_video === "true" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <MediaUploader
                    label="Vídeo Desktop"
                    accept="video"
                    folder="plataforma/hero/videos"
                    currentUrl={formData.hero_video_desktop || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, hero_video_desktop: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, hero_video_desktop: null })
                    }
                    dimensions="2560x1440"
                    maxSizeMB={100}
                  />
                  <MediaUploader
                    label="Vídeo Mobile"
                    accept="video"
                    folder="plataforma/hero/videos"
                    currentUrl={formData.hero_video_mobile || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, hero_video_mobile: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, hero_video_mobile: null })
                    }
                    dimensions="1080x1920"
                    maxSizeMB={100}
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <MediaUploader
                    label="Banner Desktop"
                    accept="image"
                    folder="plataforma/hero/banners"
                    currentUrl={formData.hero_banner_desktop || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, hero_banner_desktop: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, hero_banner_desktop: null })
                    }
                    dimensions="2560x1440"
                    aspectRatio={2560 / 1440}
                    maxSizeMB={5}
                  />
                  <MediaUploader
                    label="Banner Mobile"
                    accept="image"
                    folder="plataforma/hero/banners"
                    currentUrl={formData.hero_banner_mobile || undefined}
                    onUploadSuccess={(url) =>
                      setFormData({ ...formData, hero_banner_mobile: url })
                    }
                    onRemove={() =>
                      setFormData({ ...formData, hero_banner_mobile: null })
                    }
                    dimensions="1080x1920"
                    aspectRatio={1080 / 1920}
                    maxSizeMB={5}
                  />
                </div>
              )}

              {/* Hero Text */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Título do Header</Label>
                  <Input
                    id="hero-title"
                    value={formData.hero_title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_title: e.target.value })
                    }
                    placeholder="BíbliaToonKIDS – A Bíblia Ganha Vida..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-description">Descrição do Header</Label>
                  <Textarea
                    id="hero-description"
                    value={formData.hero_description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_description: e.target.value })
                    }
                    placeholder="Descrição que aparece abaixo do título..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
