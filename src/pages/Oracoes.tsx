import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { CategoryGrid, categories } from "@/components/oracoes/CategoryGrid";
import { PrayerCard } from "@/components/oracoes/PrayerCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookHeart, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
interface Prayer {
  id: string;
  title: string;
  content: string;
  category: string;
  icon_name: string;
  display_order: number;
}
const Oracoes = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("familia");
  const [showFavorites, setShowFavorites] = useState(false);
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();

  // Fetch prayers
  const {
    data: prayers = [],
    isLoading: loadingPrayers
  } = useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("prayers").select("*").eq("available", true).order("display_order", {
        ascending: true
      });
      if (error) throw error;
      return data as Prayer[];
    }
  });

  // Fetch user favorites
  const {
    data: favorites = [],
    isLoading: loadingFavorites
  } = useQuery({
    queryKey: ["user-favorite-prayers", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("user_favorite_prayers").select("prayer_id").eq("user_id", user!.id);
      if (error) throw error;
      return data.map(f => f.prayer_id);
    }
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (prayerId: string) => {
      if (!user) {
        toast.error("Faça login para favoritar orações");
        throw new Error("Not authenticated");
      }
      const isFavorite = favorites.includes(prayerId);
      if (isFavorite) {
        const {
          error
        } = await supabase.from("user_favorite_prayers").delete().eq("user_id", user.id).eq("prayer_id", prayerId);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("user_favorite_prayers").insert({
          user_id: user.id,
          prayer_id: prayerId
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-favorite-prayers", user?.id]
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Not authenticated") {
        toast.error("Erro ao atualizar favorito");
      }
    }
  });
  const handleToggleFavorite = (prayerId: string) => {
    toggleFavoriteMutation.mutate(prayerId);
  };
  const handleSelectCategory = (category: string | null) => {
    setShowFavorites(false);
    setSelectedCategory(category);
  };
  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setSelectedCategory(null);
    }
  };

  // Filter prayers based on selection
  const filteredPrayers = showFavorites ? prayers.filter(p => favorites.includes(p.id)) : selectedCategory ? prayers.filter(p => p.category === selectedCategory) : prayers;
  const selectedCategoryName = showFavorites ? "Favoritos" : categories.find(c => c.id === selectedCategory)?.name || "Todas";
  return <div className="min-h-screen bg-black relative">
      <FuturisticNavbar />

      <div className="container mx-auto px-4 pt-16 pb-32">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center w-full max-w-3xl">
            {/* Video Animation */}
            <div className="flex justify-center w-full mb-6">
              <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
                <video src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/materials/oracoes.mp4" className="w-full h-auto" style={{
                maxHeight: "280px"
              }} autoPlay muted playsInline loop onError={e => {
                // Hide video container if video fails to load
                (e.target as HTMLVideoElement).parentElement?.classList.add("hidden");
              }} />
              </GlassCard>
            </div>

            <GlassCard className="w-full text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                  Livrinho de Orações
                </h1>
              </div>
              <p className="text-foreground/80 text-lg">
                Encontre a oração perfeita para cada momento
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-4xl mx-auto">
          <CategoryGrid selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} showFavorites={showFavorites} onToggleFavorites={handleToggleFavorites} favoritesCount={favorites.length} />
        </div>

        {/* Prayers List */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            {selectedCategoryName}
            <span className="text-sm font-normal text-foreground/60">
              ({filteredPrayers.length} {filteredPrayers.length === 1 ? "oração" : "orações"})
            </span>
          </h2>

          {loadingPrayers || loadingFavorites ? <div className="space-y-4">
              {[1, 2, 3].map(i => <GlassCard key={i}>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </GlassCard>)}
            </div> : filteredPrayers.length === 0 ? <GlassCard className="text-center py-12">
              <BookHeart className="mx-auto mb-4 text-primary/40" size={48} />
              <p className="text-foreground/60">
                {showFavorites ? "Você ainda não favoritou nenhuma oração" : "Nenhuma oração encontrada nesta categoria"}
              </p>
            </GlassCard> : <div className="space-y-4">
              {filteredPrayers.map(prayer => <PrayerCard key={prayer.id} id={prayer.id} title={prayer.title} content={prayer.content} isFavorite={favorites.includes(prayer.id)} onToggleFavorite={handleToggleFavorite} />)}
            </div>}
        </div>
      </div>
    </div>;
};
export default Oracoes;